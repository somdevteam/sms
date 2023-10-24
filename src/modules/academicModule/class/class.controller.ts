import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import {ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import { ApiBaseResponse } from 'src/common/dto/apiresponses.dto';

@Controller('class')
@ApiTags('Class Apis')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.classService.findAll();
  }

  @Get('classesNotInLevel/:branchId')
  async findClassesNotInLevelClass(@Param('branchId') branchId: number): Promise<ApiBaseResponse> {
    const classes = await this.classService.findClassesNotInLevelClassWithBranch(branchId);
    return new ApiBaseResponse('classes',HttpStatus.OK,classes);
  }

  @Get('allsections')
  async getClassWithSections() {
    return this.classService.getClassWithSections();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() updateClassDto) {
    return this.classService.update(updateClassDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classService.remove(+id);
  }
}
