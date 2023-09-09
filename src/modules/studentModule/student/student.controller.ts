import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('add')
  create(@Body() createStudentDto:CreateStudentDto) {
    const data = this.studentService.getStudentsByClassIdAndSectionId(createStudentDto.classId,createStudentDto.sectionId);
    console.log(data);
    return data;
   //  return this.studentService.create(createStudentDto);
  }

  @Get('allstudents')
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
