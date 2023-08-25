import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import {ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";

@Controller('subject')
@ApiTags('SubjectApis')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.subjectService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/')
  update(@Body() updateSubjectDto) {
    return this.subjectService.update(updateSubjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectService.remove(+id);
  }
}
