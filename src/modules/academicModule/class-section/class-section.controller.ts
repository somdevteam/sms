import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassSectionService } from './class-section.service';
import { CreateClassSectionDto } from './dto/create-class-section.dto';
import { UpdateClassSectionDto } from './dto/update-class-section.dto';

@Controller('class-section')
export class ClassSectionController {
  constructor(private readonly classSectionService: ClassSectionService) {}

  @Post()
  create(@Body() createClassSectionDto: CreateClassSectionDto) {
    return this.classSectionService.create(createClassSectionDto);
  }

  @Get()
  findAll() {
    return this.classSectionService.findAll();
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
