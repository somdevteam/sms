import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { CreateAcademicDto } from './dto/create-academic.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {ApiTags} from "@nestjs/swagger";
import { ApiBaseResponse } from 'src/common/dto/apiresponses.dto';

@Controller('academic')
@ApiTags('Academic Apis')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createAcademicDto: CreateAcademicDto): Promise<ApiBaseResponse> {
    await this.academicService.create(createAcademicDto);
    return new ApiBaseResponse('academic saved',HttpStatus.OK,null);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
 async findAll(): Promise<ApiBaseResponse> {
    const academic = await this.academicService.findAll();
    return new ApiBaseResponse('academic lists',HttpStatus.OK,academic)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload:CreateAcademicDto): Promise<ApiBaseResponse> {
    const academic = await this.academicService.update(+id, payload);
    return new ApiBaseResponse('academic updated successfully',HttpStatus.OK,academic)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.academicService.remove(+id);
  }
}
