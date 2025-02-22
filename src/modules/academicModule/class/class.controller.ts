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
  async create(@Body() createClassDto: CreateClassDto): Promise<ApiBaseResponse> {
    const result = await this.classService.create(createClassDto);
    return new ApiBaseResponse('Class created successfully', HttpStatus.CREATED, result);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<ApiBaseResponse> {
    const classes = await this.classService.findAll();
    return new ApiBaseResponse('Classes retrieved successfully', HttpStatus.OK, classes);
  }

  @Get('classesNotInLevel/:branchId')
  async findClassesNotInLevelClass(@Param('branchId') branchId: number): Promise<ApiBaseResponse> {
    const classes = await this.classService.findClassesNotInLevelClassWithBranch(branchId);
    return new ApiBaseResponse('Classes retrieved successfully', HttpStatus.OK, classes);
  }

  @Get('allsections')
  async getClassWithSections(): Promise<ApiBaseResponse> {
    const classes = await this.classService.getClassWithSections();
    return new ApiBaseResponse('Class sections retrieved successfully', HttpStatus.OK, classes);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiBaseResponse> {
    const result = await this.classService.findOne(+id);
    return new ApiBaseResponse('Class retrieved successfully', HttpStatus.OK, result);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() updateClassDto): Promise<ApiBaseResponse> {
    const result = await this.classService.update(updateClassDto);
    return new ApiBaseResponse('Class updated successfully', HttpStatus.OK, result);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiBaseResponse> {
    const result = await this.classService.remove(+id);
    return new ApiBaseResponse('Class deleted successfully', HttpStatus.OK, result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('list/all')
  async findAllClasses(): Promise<ApiBaseResponse> {
    const classes = await this.classService.findAllClasses();
    return new ApiBaseResponse('Classes list retrieved successfully', HttpStatus.OK, classes);
  }
}
