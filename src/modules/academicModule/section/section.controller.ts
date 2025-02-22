import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus} from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import {ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import { ApiBaseResponse } from 'src/common/dto/apiresponses.dto';

@Controller('section')
@ApiTags('Section-Apis')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createSectionDto: CreateSectionDto): Promise<ApiBaseResponse> {
    const result = await this.sectionService.create(createSectionDto);
    return new ApiBaseResponse('Section created successfully', HttpStatus.CREATED, result);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<ApiBaseResponse> {
    const sections = await this.sectionService.findAll();
    return new ApiBaseResponse('Sections retrieved successfully', HttpStatus.OK, sections);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiBaseResponse> {
    const result = await this.sectionService.findOne(+id);
    return new ApiBaseResponse('Section retrieved successfully', HttpStatus.OK, result);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() updateSectionDto): Promise<ApiBaseResponse> {
    const result = await this.sectionService.update(updateSectionDto);
    return new ApiBaseResponse('Section updated successfully', HttpStatus.OK, result);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiBaseResponse> {
    const result = await this.sectionService.remove(+id);
    return new ApiBaseResponse('Section deleted successfully', HttpStatus.OK, result);
  }

  @Post('/sectionsByFilter')
  async findSectionByFilter(@Body() payload: any): Promise<ApiBaseResponse> {
    const sections = await this.sectionService.findSectionByFilter(payload);
    return new ApiBaseResponse('Sections retrieved successfully', HttpStatus.OK, sections);
  }
}
