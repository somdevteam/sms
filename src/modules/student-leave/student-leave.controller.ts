import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentLeaveService } from './student-leave.service';
import { CreateStudentLeaveDto } from './dto/create-student-leave.dto';
import { UpdateStudentLeaveDto } from './dto/update-student-leave.dto';

@Controller('student-leave')
export class StudentLeaveController {
  constructor(private readonly studentLeaveService: StudentLeaveService) {}

  @Post('create')
  create(@Body() createStudentLeaveDto: CreateStudentLeaveDto) {
    return this.studentLeaveService.create(createStudentLeaveDto);
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
    return this.studentLeaveService.update(+id, updateStudentLeaveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentLeaveService.remove(+id);
  }
}
