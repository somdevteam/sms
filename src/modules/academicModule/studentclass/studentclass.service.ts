// studentcCass.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentClass } from './entities/studentclass.entity';
import {StudentclassDto} from "./dto/studentclass.dto";
@Injectable()
export class StudentClassService {
    constructor(
        @InjectRepository(StudentClass)
        private readonly studentClassRepository: Repository<StudentClass>,
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
}

