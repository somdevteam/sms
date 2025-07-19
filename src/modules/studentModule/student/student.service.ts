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
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Responsible } from '../responsible/entities/responsible.entity';
import { StudentClass } from '../studentclass/entities/studentclass.entity';
import { ClassSectionService } from '../../academicModule/class-section/class-section.service';
import { ResponsibleService } from '../responsible/responsible.service';
import { StudentClassService } from '../studentclass/studentclass.service';
import { StudentsByClassSectionDto } from './dto/class-section.dto';
import { CurrentUser } from 'src/common/dto/currentuser.dto';
import { BranchAcademicService } from 'src/modules/branch-academic/branch-academic.service';
import { ActiveStudentDto } from './dto/active-student.dto';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student) private studentRepository: Repository<Student>,
        @InjectRepository(Responsible) private responsibleRepository: Repository<Responsible>,
        private readonly responsibleService: ResponsibleService,
        @InjectRepository(StudentClass) private studentClassRepository: Repository<StudentClass>,
        @Inject(forwardRef(() => StudentClassService))
        private readonly studentClassService: StudentClassService,
        private readonly classSectionService: ClassSectionService,
        private readonly academicBranchService: BranchAcademicService,
    ) {}

    async create(payload: CreateStudentDto, currentUser: CurrentUser): Promise<Student | null> {
        try {
            let savedResponsible = null;
            if (!payload.branchId) {
                throw new NotFoundException('Branch ID is required');
            }

            const academicBranch = await this.academicBranchService.findActiveBranchAcademic(payload.branchId);
            const classSection = await this.classSectionService.getSectionIdByClassIdAndSectionId(
                payload.classId,
                payload.sectionId,
                academicBranch.academicBranchId,
            );

            const existingStudent = await this.findByRollNumber(payload.rollNumber);
            if (existingStudent) {
                throw new ConflictException('Student with this roll number already exists');
            }

            let responsible = await this.responsibleService.getByPhone(payload.responsiblePhone);
            if (!responsible) {
                const newResponsible = this.responsibleRepository.create({
                    responsiblename: payload.responsibleName,
                    phone: payload.responsiblePhone,
                });
                savedResponsible = await this.responsibleRepository.save(newResponsible);
            }

            const student = this.studentRepository.create({
                firstname: payload.firstName,
                middlename: payload.middleName,
                lastname: payload.lastName,
                rollNumber: payload.rollNumber,
                Sex: payload.gender,
                dob: payload.dateOfBirth,
                bob: payload.pob,
                responsible: responsible ? responsible : savedResponsible,
            });

            const savedStudent = await this.studentRepository.save(student);
            if (!savedStudent) {
                throw new InternalServerErrorException('An error occurred while creating the student');
            }

            const studentClass = this.studentClassRepository.create({
                student: savedStudent,
                classSection: classSection,
                dateCreated: new Date(),
            });

            await this.studentClassRepository.save(studentClass);
            return savedStudent;
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'An error occurred while creating student');
        }
    }

    findAll() {
        return this.studentRepository.find();
    }

    findOne(id: number): Promise<Student> {
        return this.studentRepository.findOne({ where: { studentid: id } });
    }

    async findByRollNumber(rollNumber: number): Promise<Student> {
        return this.studentRepository.findOne({ where: { rollNumber },relations:['studentClass'] });
    }


    async findStudentByResponsibleId(responsibleId: number): Promise<Student[ ] | undefined> {
        return this.studentRepository.createQueryBuilder("student")
          .leftJoinAndSelect("student.studentClass", "studentClass")
          .leftJoinAndSelect("studentClass.classSection", "classSection")
          .leftJoinAndSelect("classSection.class","class")
          .leftJoinAndSelect("classSection.section","section")
          .leftJoinAndSelect("class.levelclass","levelClass")
          .leftJoinAndSelect("levelClass.level","level")
          .leftJoinAndSelect("levelClass.class","class1")
          .where("student.responsibleid = :responsibleId", { responsibleId })
          .getMany();
    }

    async findStudentByMobile(responsibleId: number): Promise<Student[ ] | undefined> {
        return this.studentRepository.createQueryBuilder("student")
          .leftJoinAndSelect("student.studentClass", "studentClass")
          .leftJoinAndSelect("studentClass.classSection", "classSection")
          .leftJoinAndSelect("classSection.class","class")
          .leftJoinAndSelect("classSection.section","section")
          .leftJoinAndSelect("class.levelclass","levelClass")
          .leftJoinAndSelect("levelClass.level","level")
          .leftJoinAndSelect("levelClass.class","class1")
          .where("student.responsibleid = :responsibleId", { responsibleId })
          .getMany();
    }

    async findStudentRollNumber(rollNumber: string): Promise<Student[ ] | undefined> {
        return this.studentRepository.createQueryBuilder("student")
          .leftJoinAndSelect("student.studentClass", "studentClass")
          .leftJoinAndSelect("studentClass.classSection", "classSection")
          .leftJoinAndSelect("classSection.class","class")
          .leftJoinAndSelect("classSection.section","section")
          .leftJoinAndSelect("class.levelclass","levelClass")
          .leftJoinAndSelect("levelClass.level","level")
          .leftJoinAndSelect("levelClass.class","class1")
          .where("student.rollNumber = :rollNumber", { rollNumber })
          .getMany();
    }

    async findStudentByResponsibleMobile(mobile: number): Promise<Student[ ] | undefined> {
        return this.studentRepository.createQueryBuilder("student")
          .leftJoinAndSelect("student.studentClass", "studentClass")
          .leftJoinAndSelect("studentClass.classSection", "classSection")
          .leftJoinAndSelect("classSection.class","class")
          .leftJoinAndSelect("classSection.section","section")
          .leftJoinAndSelect("class.levelclass","levelClass")
          .leftJoinAndSelect("levelClass.level","level")
          .leftJoinAndSelect("levelClass.class","class1")
          .leftJoinAndSelect("student.responsible","responsible")
          .where("responsible.phone = :mobile", { mobile })
          .getMany();
    }
    async findStudentByStudentId(responsibleId: number): Promise<Student[ ] | undefined> {
        return this.studentRepository.createQueryBuilder("student")
          .leftJoinAndSelect("student.studentClass", "studentClass")
          .where("student.responsibleid = :responsibleId", { responsibleId })
          .getMany();
    }
    // async findStudentByResponsibleId(responsibleId: number): Promise<Student> {
    //     return this.studentRepository.findOne({ where: { responsible : responsibleId  },relations:['studentClass'] });
    // }


    async update(id: number, payload: UpdateStudentDto) {
        const studentToUpdate = await this.studentRepository.findOne({ where: { studentid: id } });

        if (!studentToUpdate) {
            throw new NotFoundException('Student not found');
        }

        const responsible = await this.responsibleService.findOne(payload.responsibleId);
        if (!responsible) {
            throw new NotFoundException('The responsible you selected does not exist');
        }

        try {
            studentToUpdate.firstname = payload.firstName;
            studentToUpdate.middlename = payload.middleName;
            studentToUpdate.lastname = payload.lastName;
            studentToUpdate.bob = payload.pob;
            studentToUpdate.responsible = responsible;

            await this.studentRepository.update(studentToUpdate.studentid, studentToUpdate);
            return 'Update successful';
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'An error occurred while updating');
        }
    }

    async remove(id: number) {
        const studentToRemove = await this.studentRepository.findOne({ where: { studentid: id } });
        if (!studentToRemove) {
            throw new NotFoundException('Student not found');
        }
        await this.studentRepository.delete(id);
        return 'Delete successful';
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

    async findActiveStudentsByBranch(branchId: number): Promise<ActiveStudentDto[]> {
        const students = await this.studentRepository
            .createQueryBuilder('student')
            .select([
                'student.studentid',
                'studentClass.studentClassId as studentclassid',
                'student.branchId as branchid',
                'classSection.classId as levelClassid',
                'levelclass.levelid as levelid',
                'level.levelFee as levelfee',
                'academics.academicYear as academicYear',
                'academic_branch.academicId as academicId'
            ])
            .leftJoin('student.studentClass', 'studentClass')
            .leftJoin('studentClass.classSection', 'classSection')
            .leftJoin('classSection.class', 'class')
            .leftJoin('class.levelclass', 'levelclass')
            .leftJoin('levelclass.level', 'level')
            .leftJoin('classSection.branchAcademic', 'academic_branch')
            .leftJoin('academic_branch.academic', 'academics')
            .where('student.isActive = :isActive', { isActive: true })
            .andWhere('student.branchId = :branchId', { branchId })
            .andWhere('academics.isActive = :isActive', { isActive: true })
            .getRawMany();

        return students.map(student => ({
            studentid: student.student_studentid,
            studentclassid: student.studentclassid,
            branchid: student.branchid,
            levelClassid: student.levelClassid,
            levelid: student.levelid,
            levelfee: student.levelfee,
            academicYear: student.academicYear,
            academicId: student.academicId
        }));
    }
}
