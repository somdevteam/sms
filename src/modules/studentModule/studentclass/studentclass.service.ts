// studentcCass.service.ts
import {forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentClass } from './entities/studentclass.entity';
import {StudentclassDto} from "./dto/studentclass.dto";
import {StudentService} from "../student/student.service";
import {ClassSectionService} from "../../academicModule/class-section/class-section.service";
@Injectable()
export class StudentClassService {
    constructor(
        @InjectRepository(StudentClass)
        private readonly studentClassRepository: Repository<StudentClass>,
        @Inject(forwardRef(() => StudentService))
        private readonly studentService : StudentService,
        private readonly classSectionService : ClassSectionService,
    ) {}

    async create(studentClassData: StudentclassDto): Promise<StudentClass> {
        const studentClass =  new StudentClass();
     //   studentClass.student = studentClassData.studentId;
       // studentClass.classSection = studentClassData.classSectionId;
        studentClass.dateCreated = new Date();
        // await this.studentClassRepository.create(studentClass);
        return await this.studentClassRepository.save(studentClass);
    }

    async findAll(): Promise<StudentClass[]> {
        return await this.studentClassRepository.find();
    }

    async findOne(studentClassId: number): Promise<StudentClass> {
        return await this.studentClassRepository.findOne(null);
    }

    async update(studentClassId: number, studentClassData: Partial<StudentClass>): Promise<StudentClass> {
        await this.studentClassRepository.update(studentClassId, studentClassData);
        return await this.studentClassRepository.findOne(null);
    }

    async remove(studentClassId: number): Promise<void> {
        await this.studentClassRepository.delete(studentClassId);
    }

    async promoteStudents(studentClassDataArray: StudentclassDto[]): Promise<StudentClass[]> {
        const studentClasses: StudentClass[] = [];

        for (const studentClassData of studentClassDataArray) {
            const existingStudent = await this.studentService.findOne(studentClassData.studentId);
            if (!existingStudent) {
                throw new NotFoundException('Student not found');
            }

            const existingClassSection = await this.classSectionService.getSectionIdByClassIdAndSectionId(
                studentClassData.classId,
                studentClassData.sectionId
            );

            const studentClass = new StudentClass();
            studentClass.student = existingStudent;
            studentClass.classSection = existingClassSection;
            studentClass.dateCreated = new Date();

            await this.studentClassRepository.create(studentClass);
            studentClasses.push(await this.studentClassRepository.save(studentClass));
        }

        return studentClasses;
    }


}

