import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {ApiTags} from "@nestjs/swagger";

@Controller('level')
@ApiTags('Level Apis')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelService.create(createLevelDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.levelService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.levelService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() updateLevelDto) {
    return this.levelService.update(updateLevelDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelService.remove(+id);
  }
}
