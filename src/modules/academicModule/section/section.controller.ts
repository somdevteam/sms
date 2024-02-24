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
  create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionService.create(createSectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async findAll(): Promise<ApiBaseResponse> {
    const sections = await this.sectionService.findAll();
    return new ApiBaseResponse(null,HttpStatus.OK,sections)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/')
  update(@Body() updateSectionDto) {
    return this.sectionService.update( updateSectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionService.remove(+id);
  }

  @Get('/allsections')
  async findAllsection(): Promise<ApiBaseResponse> {
    const sections = await this.sectionService.findSections();
    return new ApiBaseResponse(null,HttpStatus.OK,sections)
  }
}
