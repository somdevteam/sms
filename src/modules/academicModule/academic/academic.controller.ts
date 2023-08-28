import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { CreateAcademicDto } from './dto/create-academic.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {ApiTags} from "@nestjs/swagger";

@Controller('academic')
@ApiTags('Academic Apis')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAcademicDto: CreateAcademicDto) {
    return this.academicService.create(createAcademicDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.academicService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAcademicDto) {
    return this.academicService.update(+id, updateAcademicDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.academicService.remove(+id);
  }
}
