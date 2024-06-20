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
    return new ApiBaseResponse(null, 200, exams);
  }

  @Get()
  async findAll(): Promise<any> {
    const exams = await this.examsService.findAll();
    return new ApiBaseResponse('', 200, exams)
  }

  @Post('/addexaminfo')
  async createExamInfo(@Body() payload: any): Promise<any> {
    await this.examsService.createExamInfo(payload);
    return new ApiBaseResponse('exam updated', 200, null);
  }

  @Patch('updatexaminfo/:id')
  async updateExamInfo(@Param('id') id: string, @Body() payload: any): Promise<any> {
    await this.examsService.updateExamInfo(+id, payload);
    return new ApiBaseResponse('exam updated', 200, null);
  }
}
