import {
    ConflictException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Student } from './entities/student.entity';
import { ClassSectionService } from '../../academicModule/class-section/class-section.service';
import { StudentsByClassSectionDto } from './dto/class-section.dto';
import { CurrentUser } from 'src/common/dto/currentuser.dto';
import { BranchAcademicService } from 'src/modules/branch-academic/branch-academic.service';
import { Responsible } from './entities/responsible.entity';
import { StudentClass } from './entities/student-class.entity';
import { StudentType } from './entities/student_type.entity';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student) private studentRepository: Repository<Student>,
        private readonly classSectionService: ClassSectionService,
        private readonly academicBranchService: BranchAcademicService,
        @InjectRepository(Responsible) private responsibleRepository: Repository<Responsible>,
        @InjectRepository(StudentClass) private studentClassRepository: Repository<StudentClass>,
        @InjectRepository(StudentType) private studentTypeRepository: Repository<StudentType>,
    ) {}

    async create(payload: CreateStudentDto, currentUser: CurrentUser): Promise<Student | null> {
        const { firstName, middleName, lastName, rollNumber, gender, pob, responsibleType, 
                responsibleId, responsibleName, responsiblePhone, classId, sectionId ,studentTypeId} = payload;

        if (!payload.branchId) {
            throw new NotFoundException('Branch ID is required');
        }

        const academicBranch = await this.academicBranchService.findActiveBranchAcademic(payload.branchId);
        const classSection = await this.classSectionService.getSectionIdByClassIdAndSectionId(
            classId, sectionId, academicBranch.academicBranchId
        );

        const existingStudent = await this.findByRollNumber(rollNumber);
        if (existingStudent) {
            throw new ConflictException('Student with this roll number already exists');
        }

        let responsible: Responsible | null;

        if (responsibleType === 'existing' && responsibleId) {
            responsible = await this.responsibleRepository.findOneBy({ responsibleid: responsibleId });
        } else if (responsibleType === 'new' && responsibleName && responsiblePhone) {
            responsible = await this.responsibleRepository.save(this.responsibleRepository.create({
                responsiblename: responsibleName,
                phone: responsiblePhone,
            }));
        }

        const studentType = await this.studentTypeRepository.findOneBy({id: studentTypeId});
        
        const student = this.studentRepository.create({
            firstName, middleName, lastName, rollNumber, sex: gender, dob: payload.dateOfBirth, bob: pob, responsible,
            studentType
        });

        const savedStudent = await this.studentRepository.save(student);
        if (!savedStudent) {
            throw new InternalServerErrorException('An error occurred while creating the student');
        }

        await this.studentClassRepository.save(this.studentClassRepository.create({
            student: savedStudent,
            classSection,
            dateCreated: new Date(),
        }));

        return savedStudent;
    }

    findAll() {
        return this.studentRepository.find();
    }

    findOne(id: number): Promise<Student> {
        return this.studentRepository.findOne({ where: { studentId: id } });
    }

    async findByRollNumber(rollNumber: number): Promise<Student> {
        return this.studentRepository.findOne({ where: { rollNumber },relations:['studentClass'] });
    }


    async update(id: number, payload: UpdateStudentDto) {
        const studentToUpdate = await this.studentRepository.findOne({ where: { studentId: id } });

        if (!studentToUpdate) {
            throw new NotFoundException('Student not found');
        }

        const responsible = await this.responsibleRepository.findOneBy({responsibleid: payload.responsibleId});
        if (!responsible) {
            throw new NotFoundException('The responsible you selected does not exist');
        }

        try {
            studentToUpdate.firstName = payload.firstName;
            studentToUpdate.middleName = payload.middleName;
            studentToUpdate.lastName = payload.lastName;
            studentToUpdate.bob = payload.pob;
            studentToUpdate.responsible = responsible;

            await this.studentRepository.update(studentToUpdate.studentId, studentToUpdate);
            return 'Update successful';
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'An error occurred while updating');
        }
    }

    async getStudentsByClassIdAndSectionId(
        payload: StudentsByClassSectionDto,
    ): Promise<Student[]> {

        const academicBranch = await this.academicBranchService.findActiveBranchAcademic(payload.branchId);
        const queryBuilder = this.studentRepository
        .createQueryBuilder('s')
        .leftJoin('s.studentClass', 'sc')
        .leftJoin('sc.classSection', 'cs')
        .leftJoin('cs.section', 'sec')
        .leftJoin('cs.class', 'c')
        .leftJoin('cs.branchAcademic', 'ba')
        .leftJoin('ba.branch', 'b')
        .leftJoin('ba.academic', 'a')
        .leftJoin('s.responsible', 'rp')
        .select([
            's.studentId AS studentId',
            's.firstName AS firstName',
            's.middleName AS middleName',
            's.lastName AS lastName',
            'c.classname as className',
            'sec.sectionname as sectionName',
            's.responsibleId AS responsibleId',
            's.bob AS pob',
            'a.academicYear AS academicYear',
            's.rollNumber AS rollNumber',
            'rp.responsibleName AS responsibleName',
            'rp.phone AS responsiblePhone',
            'b.branchId AS branchId',
            'cs.sectionId AS sectionId',
        ])
        .where('ba.academicBranchId = :academicBranchId', { academicBranchId: academicBranch.academicBranchId });
        if (payload.rollNumber) {
            queryBuilder.andWhere('s.rollNumber = :rollNumber', { rollNumber: payload.rollNumber });
        }  
        if (payload.classId){
            queryBuilder.andWhere('c.classId = :classId', { classId: payload.classId });
        }
        if (payload.sectionId) {
            queryBuilder.andWhere('cs.sectionId = :sectionId', {sectionId: payload.sectionId });
        }
        return queryBuilder.getRawMany();

    }

    async getStudentCountByBranchAndAcademic(branchId: number, academicId: number): Promise<any> {
        const queryBuilder = this.studentRepository
            .createQueryBuilder('student')
            .leftJoinAndSelect('student.studentClass', 'studentclass')
            .leftJoinAndSelect('studentclass.classSection', 'ClassSection')
            .leftJoinAndSelect('ClassSection.branchAcademic', 'academicBranch')
            .where('academicBranch.branchId = :branchId', { branchId })
            .andWhere('academicBranch.academicId = :academicId', { academicId });

        return queryBuilder.getCount();
    }

    async searchResponsible(filter: string){
        return await this.responsibleRepository.find({
            where:{
                phone: Like(`%${filter}%`)
            }
        });
    }

    async getStudentTypes(): Promise<StudentType[]> {
        return await this.studentTypeRepository.find();
    }
}
