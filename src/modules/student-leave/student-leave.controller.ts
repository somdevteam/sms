import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentLeaveService } from './student-leave.service';
import { CreateStudentLeaveDto } from './dto/create-student-leave.dto';
import { UpdateStudentLeaveDto } from './dto/update-student-leave.dto';
import {ApiResponse} from "@nestjs/swagger";
import {ApiBaseResponse} from "../../common/dto/apiresponses.dto";

@Controller('student-leave')
export class StudentLeaveController {
  constructor(private readonly studentLeaveService: StudentLeaveService) {}

  @Post('create')
  create(@Body() createStudentLeaveDto: CreateStudentLeaveDto) {
    const result = this.studentLeaveService.create(createStudentLeaveDto);
   // console.log("Leave created successfully!",result)
    return new ApiBaseResponse('Student-Leave created successfully!',6006,result);
  }

  @Get()
  findAll() {
    return this.studentLeaveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentLeaveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentLeaveDto: UpdateStudentLeaveDto) {
    let result = this.studentLeaveService.update(+id, updateStudentLeaveDto);
    return new ApiBaseResponse('Record Updated successfully!',6006,result);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
     let result = this.studentLeaveService.remove(+id);
     return new ApiBaseResponse('Deleted success!',6006,result)
  }
}
