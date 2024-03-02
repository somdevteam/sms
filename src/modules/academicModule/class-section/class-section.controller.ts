import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { ClassSectionService } from './class-section.service';
import { CreateClassSectionDto } from './dto/create-class-section.dto';
import { SectionByClassDto } from './dto/SectionByClas.dto';
import { UpdateClassSectionDto } from './dto/update-class-section.dto';
import {ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import { ApiBaseResponse } from 'src/common/dto/apiresponses.dto';

@Controller('class-section')
@ApiTags('class Section Apis')
export class ClassSectionController {
  constructor(private readonly classSectionService: ClassSectionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createClassSectionDto: CreateClassSectionDto) {
   // return this.classSectionService.getAcademicByClassAndSectionId(createClassSectionDto.classid,createClassSectionDto.sectionid);
    return this.classSectionService.create(createClassSectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('section')
  findSectionByClass(@Body() payload:SectionByClassDto) {
    return this.classSectionService.fetchSectionByClassId(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classSectionService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(updateClassSectionDto: UpdateClassSectionDto) {
    return this.classSectionService.update(updateClassSectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classSectionService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('assingSectionsToClass')
  async assingSectionsToClass(@Body() createClassSectionDto: SectionByClassDto) : Promise<ApiBaseResponse> {

    const resp = await this.classSectionService.assignSectionToClass(createClassSectionDto);
    return new ApiBaseResponse('added successfully',200, resp);
  }

}
