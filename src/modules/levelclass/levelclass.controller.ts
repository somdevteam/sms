import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LevelclassService } from './levelclass.service';
import { CreateLevelclassDto } from './dto/create-levelclass.dto';

@Controller('levelclass')
export class LevelclassController {
  constructor(private readonly levelclassService: LevelclassService) {}

  @Post()
  create(@Body() createLevelclassDto: CreateLevelclassDto) {
    return this.levelclassService.create(createLevelclassDto);
  }

  @Get()
  findAll() {
    return this.levelclassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.levelclassService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLevelclassDto) {
    return this.levelclassService.update(+id, updateLevelclassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelclassService.remove(+id);
  }
}
