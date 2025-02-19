import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ClassSubjectService } from './class-subject.service';
import {ApiTags} from "@nestjs/swagger";
import { CreateClassSubjectDto } from './dto/create-class-subject.dto';
import { ApiBaseResponse } from 'src/common/dto/apiresponses.dto';

@Controller('class-subject')
@ApiTags('Class Subject Controller')
export class ClassSubjectController {
  constructor(private readonly classSubjectService: ClassSubjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createClassSubjectDto: CreateClassSubjectDto) {
    const resp = await this.classSubjectService.createClassSubject(createClassSubjectDto);
    return new ApiBaseResponse('Class Subject Created',200, null);
  }



  @Post('unassignedsubjects')
  async findUnassignedSubjects(@Body() payload: any) {
    const subjects =  await this.classSubjectService.findUnassignedSubjects(payload);
    return new ApiBaseResponse(null ,200, subjects);
  }

  @Get('subjects')
  async findSubjectsByClass(
    @Query('classId') classId: number,
    @Query('branchId') branchId: number,
  ) {

    if (!classId || !branchId) {
      throw new NotFoundException('Class ID and Branch ID are required');
    }

    let subjects = await this.classSubjectService.findSubjectsByClass(
      classId, 
      branchId, 
    );
    subjects = subjects.map((subject:any) => subject.subject);
    return new ApiBaseResponse(null,200, subjects);
  }

}
