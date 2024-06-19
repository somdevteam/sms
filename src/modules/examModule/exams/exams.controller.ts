import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ApiBaseResponse } from 'src/common/dto/apiresponses.dto';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) { }

  @Post()
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @Get('/findexamsbybranch')
  async findExamsByBranch(@Query('branchId', new ParseIntPipe()) branchId: number): Promise<any> {
    const exams = await this.examsService.findExamsByBranch(branchId);
    return new ApiBaseResponse(null,200,exams);
  }

  @Get()
  async findAll(): Promise<any> {
    const exams = await this.examsService.findAll();
    return new ApiBaseResponse('', 200, exams)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(+id, updateExamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examsService.remove(+id);
  }
}
