import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import {ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";

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
  @Get()
  findAll() {
    return this.sectionService.findAll();
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
}
