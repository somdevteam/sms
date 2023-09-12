// studentClass.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { StudentClassService } from './studentclass.service';
import { StudentClass } from './entities/studentclass.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {StudentclassArrayDto, StudentclassDto} from "./dto/studentclass.dto";
import {Batch} from "typeorm";
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('studentclass')
export class StudentClassController {
    constructor(
        private studentClassService: StudentClassService
    ) {}

    @Post('/createstudentclass')
    create(@Body() studentClassData: StudentclassDto): Promise<StudentClass> {
        return this.studentClassService.create(studentClassData);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getallstudentclass')
    findAll(): Promise<StudentClass[]> {
        return this.studentClassService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getstudentclassbyid/:id')
    findOne(@Param('id') id: number): Promise<StudentClass> {
        return this.studentClassService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/updatestudentclass/:id')
    update(@Param('id') id: number, @Body() studentClassData: Partial<StudentClass>): Promise<StudentClass> {
        return this.studentClassService.update(id, studentClassData);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/deletestudentclass/:id')
    remove(@Param('id') id: number): Promise<void> {
        return this.studentClassService.remove(id);
    }

    @Post('/promotestudents')
    promotion(@Body() studentClassData: StudentclassArrayDto): Promise<StudentClass[]> {
        return this.studentClassService.promoteStudents(studentClassData.students);
    }

}
