import {
    ConflictException, forwardRef, Inject,
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException
} from '@nestjs/common';
import {CreateStudentDto} from './dto/create-student.dto';
import {UpdateStudentDto} from './dto/update-student.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import {Repository} from "typeorm";
import {ApiBaseResponse} from "../../../common/dto/apiresponses.dto";

import {ClassSectionService} from "../../academicModule/class-section/class-section.service";
import {Responsible} from "../responsible/entities/responsible.entity";
import {ResponsibleService} from "../responsible/responsible.service";
import {StudentClass} from "../studentclass/entities/studentclass.entity";
import {StudentClassService} from "../studentclass/studentclass.service";
import { StudentsByClassSectionDto } from './dto/class-section.dto';
import { CurrentUser } from 'src/common/dto/currentuser.dto';
import { BranchAcademicService } from 'src/modules/branch-academic/branch-academic.service';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student) private StudentRepository: Repository<Student>,
        @InjectRepository(Responsible) private responsibleRepository: Repository<Responsible>,
        private readonly responsibleService: ResponsibleService,
        @InjectRepository(StudentClass) private studentClassRepository: Repository<StudentClass>,
        @Inject(forwardRef(() => StudentClassService))
        private readonly studentClassService: StudentClassService,
        private readonly classSectionService: ClassSectionService,
        private readonly academicBranchService: BranchAcademicService
        
    ) {
    }


    async create(payload: CreateStudentDto,currentUser:CurrentUser): Promise<Student | null> {

        try {
            let savedResponsible = null;
            const branchId =  payload.branchId
            if (!branchId) {
                throw new NotFoundException('branch id is required');
            }
            const academicBranch = await this.academicBranchService.findLatestActiveBranchAcademic(+branchId);
           const classSection = await this.classSectionService.getSectionIdByClassIdAndSectionId(payload.classId, payload.sectionId,academicBranch.academicBranchId);
           
            const responsible = await this.responsibleService.getByPhone(payload.resPhone);
            if (!responsible) {
                const newResponsible = new Responsible();
                newResponsible.responsiblename = payload.responsiblename;
                newResponsible.phone = payload.resPhone;
                savedResponsible = await this.responsibleRepository.save(newResponsible);
            }

            let student = new Student();
            student.firstname = payload.firstname;
            student.middlename = payload.middlename;
            student.lastname = payload.lastname;
            student.Sex = payload.sex;
            student.dob = new Date();
            student.bob = payload.bob;
            student.responsible = responsible ? responsible : savedResponsible;
            const savedStudent = await this.StudentRepository.save(student);

            if (!savedStudent) {
                throw new InternalServerErrorException("An error occurred while creating the responsible ");
            }

            const studentClass = new StudentClass();
            studentClass.student = savedStudent;
            studentClass.classSection =classSection;
            studentClass.dateCreated = new Date();
            const savedStudentClass = await this.studentClassRepository.save(studentClass);
            return savedStudent;
        } catch (error) {
            if (error) {
                throw new ConflictException(error.message);
                
            }
            throw new InternalServerErrorException(
                "An error occurred while creating student");
        }

    }

    findAll() {
        return this.StudentRepository.find();
    }

    findOne(id: number): Promise<Student> {
        return this.StudentRepository.findOne({where: {studentid: id}})
    }

    async update(id: number, payload: UpdateStudentDto) {
        let studentToUpdate = await this.StudentRepository.findOne({
            where: {studentid: id,}
        });

        if (!studentToUpdate) {
            throw new NotFoundException("student not found")
        }
        const responsible = await this.responsibleService.findOne(payload.responsibleId);
        if (!responsible) {
            throw new NotFoundException("The responsible you selected does not exist")
        }
        try {
            studentToUpdate.firstname = payload.firstname;
            studentToUpdate.middlename = payload.middlename;
            studentToUpdate.lastname = payload.lastname;
            studentToUpdate.Sex = payload.sex;
            studentToUpdate.dob = new Date();
            studentToUpdate.bob = payload.bob;
            // studentToUpdate.responsible = responsible;

            await this.StudentRepository.update(studentToUpdate.studentid, studentToUpdate);
            return 'Updated success';

        } catch (error) {
            if (error) {
                throw new ConflictException(error.message)
            }
            throw new InternalServerErrorException(
                "an error occurred while updating")
        }

        // return `This action updates a #${id} student`;
    }

    async remove(id: number) {
        let studentToRemove = await this.StudentRepository.findOne({where: {studentid: id}});
        if (!studentToRemove) {
            throw  new NotFoundException(new ApiBaseResponse('Responsible not found', 6006, null))
        }
        await this.StudentRepository.delete(id);
        return `Deleted success`;
    }

    async getStudentsByClassIdAndSectionId(payload:StudentsByClassSectionDto,currentUser:CurrentUser):Promise<Student[]>{
        
        if (payload.branchId == null && currentUser.branchId == null) {
            throw new NotFoundException('branchId is required');
        }
        const branchId = payload.branchId ? payload.branchId : currentUser.branchId;

     const result = (await this.StudentRepository.createQueryBuilder('student')
         .leftJoinAndSelect('student.studentClass', 'studentclass')
         .leftJoinAndSelect('studentclass.classSection', 'classSection')
         .leftJoinAndSelect('classSection.class', 'class')
         .leftJoinAndSelect('classSection.academic', 'academic')
         .leftJoinAndSelect('classSection.branch', 'branch')
         .where('classSection.classId =:classId and classSection.sectionId=:sectionId', {classId :payload.classId,sectionId: payload.sectionId})
         .andWhere('academic.academicid =:academicId and branch.branchid =:branchId', {academicId: payload.academicId,branchId})
         .select([
                 'student.studentid as studentid',
                 'student.firstname as firstname',
                 'student.middlename as lastname',
                 'student.responsibleid as responsibleid',
                 'student.bob as pob',
                 'academic.academicname as academicname'
             ]
         ).getRawMany())

     return result;
    }


    async getStudentCountByBranchAndAcademic(branchId: number, academicId: number): Promise<any> {
        const queryBuilder = this.StudentRepository
          .createQueryBuilder('student')
          .leftJoinAndSelect('student.studentClass', 'studentclass')
          .leftJoinAndSelect('studentclass.classSection', 'ClassSection')
          .leftJoinAndSelect('ClassSection.branchAcademic', 'academicBranch')
          .where('academicBranch.branchId = :branchId', { branchId })
          .andWhere('academicBranch.academicId = :academicId', { academicId });
          
    
        return queryBuilder.getMany();
      }
}
