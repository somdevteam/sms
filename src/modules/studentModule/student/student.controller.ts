import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsByClassSectionDto } from './dto/class-section.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import {ApiBaseResponse} from "../../../common/dto/apiresponses.dto";
import { GetRollNumberDto } from "./dto/getRollNumber.dto";

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
  async findStudentByClassAndSection(@Body() createStudentDto:StudentsByClassSectionDto) {
    const data =  await this.studentService.getStudentsByClassIdAndSectionId(createStudentDto);
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

  @UseGuards(JwtAuthGuard)
  @Get('responsibles')
  async searchResponsible(@Query('search') filter: string): Promise<ApiBaseResponse>{
    const data = await this.studentService.searchResponsible(filter);
    return new ApiBaseResponse('success', 200, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('studentTypes')
  async getStudentTypes(): Promise<ApiBaseResponse>{
    const data = await this.studentService.getStudentTypes();
    return new ApiBaseResponse('success', 200, data);
  }

}
