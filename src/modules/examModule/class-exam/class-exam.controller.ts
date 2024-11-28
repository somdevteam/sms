import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassExamService } from './class-exam.service';
import { CreateClassExamDto } from './dto/create-class-exam.dto';
import { UpdateClassExamDto } from './dto/update-class-exam.dto';
import { ApiBaseResponse } from 'src/common/dto/apiresponses.dto';

@Controller('class-exam')
export class ClassExamController {
  constructor(private readonly classExamService: ClassExamService) { }

  @Post()
  async create(@Body() payload: CreateClassExamDto): Promise<ApiBaseResponse> {
    await this.classExamService.create(payload);
    return new ApiBaseResponse('created successfully', 200, null);
  }

  @Get()
  findAll() {
    return this.classExamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classExamService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassExamDto: UpdateClassExamDto) {
    return this.classExamService.update(+id, updateClassExamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classExamService.remove(+id);
  }
}
