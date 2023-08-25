import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassSectionService } from './class-section.service';
import { CreateClassSectionDto } from './dto/create-class-section.dto';
import { SectionByClassDto } from './dto/SectionByClas.dto';
import { UpdateClassSectionDto } from './dto/update-class-section.dto';

@Controller('class-section')
export class ClassSectionController {
  constructor(private readonly classSectionService: ClassSectionService) {}

  @Post()
  create(@Body() createClassSectionDto: CreateClassSectionDto) {
    return this.classSectionService.create(createClassSectionDto);
  }

  @Post('section')
  findSectionByClass(@Body() payload:SectionByClassDto) {
    return this.classSectionService.fetchSectionByClassId(payload);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classSectionService.findOne(+id);
  }

  @Patch()
  update(updateClassSectionDto: UpdateClassSectionDto) {
    return this.classSectionService.update(updateClassSectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classSectionService.remove(+id);
  }
}
