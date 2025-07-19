import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsByClassSectionDto } from './dto/class-section.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import {ApiBaseResponse} from "../../../common/dto/apiresponses.dto";
import { GetRollNumberDto } from "./dto/getRollNumber.dto";
import * as util from "util";
import { createFullName } from "../../../common/enum/sms.enum";
import { ActiveStudentDto } from './dto/active-student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async create(@Body() createStudentDto:CreateStudentDto,@Request() req) {
     let studentData = await this.studentService.create(createStudentDto,req.user.user);
     return new ApiBaseResponse('successfully saved', 200, studentData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('getStudentByClassAndSection')
  async findStudentByClassAndSection(@Request() req,@Body() createStudentDto:StudentsByClassSectionDto) {
    console.warn("we reached here. ");
    const data =  await this.studentService.getStudentsByClassIdAndSectionId(createStudentDto)
    console.log(data);
    return data;
  }




  @UseGuards(JwtAuthGuard)
  @Get('allstudents')
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    var updateStudentInfo = await this.studentService.update(+id, updateStudentDto);
    return new ApiBaseResponse('successfully uppdated', 200 , updateStudentInfo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }

  @Get('count/:branchId/:academicId')
  async getStudentCountByBranchAndAcademic(
    @Param('branchId', ParseIntPipe) branchId: number,
    @Param('academicId', ParseIntPipe) academicId: number,
  ): Promise<{ count: number }> {
    const count = await this.studentService.getStudentCountByBranchAndAcademic(branchId, academicId);
    return { count };
  }

 //@UseGuards(JwtAuthGuard)
  @Post('getStudentByRollNumber')
  async findByRollNumber(@Request() req) {
    console.log("We reached here"+req.body);
    console.log()
    let studentData = await this.studentService.findByRollNumber(req.body.rollNumber);
    console.log(studentData);
    return new ApiBaseResponse('success', 200, studentData);
  }

  // @Post('getStudentsByResponsibleId')
  // async findStudentByResponsible(@Request() req) {
  //   console.log("We reached here"+req.body);
  //   console.log()
  //   let studentData = await this.studentService.findStudentByResponsibleId(req.body.responsibleId);
  //   console.log(studentData);
  //
  //   return new ApiBaseResponse('success', 200, studentData);
  // }

  @Post('getStudentsByResponsibleId')
  async findStudentByResponsible(@Request() req) {
    console.log("We reached here with data:", req.body);

    // Call the service method
    const studentData = await this.studentService.findStudentByResponsibleId(req.body.responsibleId);

    // Transform the data on the controller side
    // const transformedData = studentData.map(student => ({
    //   studentid: student.studentid,
    //   rollNumber: student.rollNumber,
    //   firstname: student.firstname,
    //   middlename: student.middlename,
    //   lastname: student.lastname,
    //   Sex: student.Sex,
    //   dob: student.dob,
    //   bob: student.bob,
    //   responsible: student.responsible,
    //   studentClass: student.studentClass,
    //   //classSection:studentClass.classSection
    //   fullName: createFullName(student.firstname, student.middlename, student.lastname),
    // }));

    const transformedData = studentData.map(student => ({
      studentid: student.studentid,
      rollNumber: (student.rollNumber).toString(),
      firstname: student.firstname,
      middlename: student.middlename,
      lastname: student.lastname,
      Sex: student.Sex,
      dob: student.dob,
      bob: student.bob,
      responsible: student.responsible,
      fullName: createFullName(student.firstname, student.middlename, student.lastname),
      studentClass: student.studentClass.map(studentClass => ({
        studentClassId: studentClass.studentClassId,
        classId: studentClass.classSection.class.classid,
        className: studentClass.classSection.class.classname,
        sectionId: studentClass.classSection.section.sectionid,
        sectionName: studentClass.classSection.section.sectionname,
        classSectionId: studentClass.classSection.classSectionId,
        levelClassId: studentClass.classSection.class.levelclass[0].levelclassid,
        levelId: studentClass.classSection.class.levelclass[0].level.levelid,
        levelName: studentClass.classSection.class.levelclass[0].level.levelname,
        levelFee: studentClass.classSection.class.levelclass[0].level.levelFee,
        isActive: studentClass.classSection.class.isactive
      }))
    }));

    console.log("Transformed data:", transformedData);

    return new ApiBaseResponse('success', 200, transformedData);
  }

  @Post('getStudentsByRollNumber')
  async findStudentByRollNumber(@Request() req) {
    console.log("We reached here with data:", req.body);

    const studentData = await this.studentService.findStudentRollNumber(req.body.rollNumber);

    const transformedData = studentData.map(student => ({
      studentid: student.studentid,
      rollNumber: (student.rollNumber).toString(),
      firstname: student.firstname,
      middlename: student.middlename,
      lastname: student.lastname,
      Sex: student.Sex,
      dob: student.dob,
      bob: student.bob,
      responsible: student.responsible,
      fullName: createFullName(student.firstname, student.middlename, student.lastname),
      studentClass: student.studentClass.map(studentClass => ({
        studentClassId: studentClass.studentClassId,
        classId: studentClass.classSection.class.classid,
        className: studentClass.classSection.class.classname,
        sectionId: studentClass.classSection.section.sectionid,
        sectionName: studentClass.classSection.section.sectionname,
        classSectionId: studentClass.classSection.classSectionId,
        levelClassId: studentClass.classSection.class.levelclass[0].levelclassid,
        levelId: studentClass.classSection.class.levelclass[0].level.levelid,
        levelName: studentClass.classSection.class.levelclass[0].level.levelname,
        levelFee: studentClass.classSection.class.levelclass[0].level.levelFee,
        isActive: studentClass.classSection.class.isactive
      }))
    }));

    console.log("Transformed data:", transformedData);

    return new ApiBaseResponse('success', 200, transformedData);
  }

  @Post('getStudentsByResponsibleMobile')
  async findStudentByResponsibleMobile(@Request() req) {
    console.log("We reached here with data:", req.body);

    const studentData = await this.studentService.findStudentByResponsibleMobile(req.body.mobile);

    const transformedData = studentData.map(student => ({
      studentid: student.studentid,
      rollNumber: (student.rollNumber).toString(),
      firstname: student.firstname,
      middlename: student.middlename,
      lastname: student.lastname,
      Sex: student.Sex,
      dob: student.dob,
      bob: student.bob,
      responsible: student.responsible,
      fullName: createFullName(student.firstname, student.middlename, student.lastname),
      studentClass: student.studentClass.map(studentClass => ({
        studentClassId: studentClass.studentClassId,
        classId: studentClass.classSection.class.classid,
        className: studentClass.classSection.class.classname,
        sectionId: studentClass.classSection.section.sectionid,
        sectionName: studentClass.classSection.section.sectionname,
        classSectionId: studentClass.classSection.classSectionId,
        levelClassId: studentClass.classSection.class.levelclass[0].levelclassid,
        levelId: studentClass.classSection.class.levelclass[0].level.levelid,
        levelName: studentClass.classSection.class.levelclass[0].level.levelname,
        levelFee: studentClass.classSection.class.levelclass[0].level.levelFee,
        isActive: studentClass.classSection.class.isactive
      }))
    }));

    console.log("Transformed data:", transformedData);

    return new ApiBaseResponse('success', 200, transformedData);
  }

  @Get('active-by-branch')
  async findActiveStudentsByBranch(@Query('branchId') branchId: number): Promise<ApiBaseResponse> {
    const students = await this.studentService.findActiveStudentsByBranch(branchId);
    return new ApiBaseResponse('Active students retrieved successfully', 200, students);
  }

}
