import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsByClassSectionDto } from './dto/class-section.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  create(@Body() createStudentDto:CreateStudentDto,@Request() req) {
     return this.studentService.create(createStudentDto,req.user.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('getStudentByClassAndSection')
  findStudentByClassAndSection(@Request() req,@Body() createStudentDto:StudentsByClassSectionDto) {
    const data = this.studentService.getStudentsByClassIdAndSectionId(createStudentDto,req.user.user);
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
  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
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
}
