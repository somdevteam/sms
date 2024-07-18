import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamInfoService } from './exam-info.service';
import { CreateExamInfoDto } from './dto/create-exam-info.dto';
import { UpdateExamInfoDto } from './dto/update-exam-info.dto';

@Controller('exam-info')
export class ExamInfoController {
  constructor(private readonly examInfoService: ExamInfoService) {}

  @Post()
  create(@Body() createExamInfoDto: CreateExamInfoDto) {
    return this.examInfoService.create(createExamInfoDto);
  }

  @Get()
  findAll() {
    return this.examInfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examInfoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamInfoDto: UpdateExamInfoDto) {
    return this.examInfoService.update(+id, updateExamInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examInfoService.remove(+id);
  }
}
