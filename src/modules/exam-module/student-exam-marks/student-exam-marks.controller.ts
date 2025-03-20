import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StudentExamMarksService } from './student-exam-marks.service';
import { ApiBaseResponse } from 'src/common/dto/apiresponses.dto';
import { ExamResultDto } from './dto/exam-result.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('student-exam-marks')
export class StudentExamMarksController {
  constructor(private readonly studentExamMarksService: StudentExamMarksService) {}

  @Post()
  async fetchStudentExamMarks(@Body() payload: ExamResultDto): Promise<ApiBaseResponse> {
    const resp = await this.studentExamMarksService.fetchStudentExamMarks(payload);
    return new ApiBaseResponse('fetched successfully',200, resp);
  }

  @Post('add')
  async addStudentExamMarks(@Body() payload: any): Promise<ApiBaseResponse> {
    const resp = await this.studentExamMarksService.addStudentExamMarks(payload);
    return new ApiBaseResponse('added successfully',200, resp);
  }

  @Patch('update/:id')
  async updateStudentExamMarks(@Body() payload: any, @Param('id') id: number): Promise<ApiBaseResponse> {
    const resp = await this.studentExamMarksService.updateStudentExamMarks(payload, id);
    return new ApiBaseResponse('updated successfully',200, resp);
  }
}
