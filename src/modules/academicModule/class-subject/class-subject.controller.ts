import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ClassSubjectService } from './class-subject.service';
import { CreateClassSubjectDto } from './dto/create-class-subject.dto';
import { UpdateClassSubjectDto } from './dto/update-class-subject.dto';

@Controller('class-subject')
export class ClassSubjectController {
  constructor(private readonly classSubjectService: ClassSubjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createClassSubjectDto: CreateClassSubjectDto) {
    return this.classSubjectService.create(createClassSubjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.classSubjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classSubjectService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() updateClassSubjectDto: UpdateClassSubjectDto) {
    return this.classSubjectService.update(updateClassSubjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classSubjectService.remove(+id);
  }
}
