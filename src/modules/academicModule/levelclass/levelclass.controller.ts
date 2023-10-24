import {Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards} from '@nestjs/common';
import { LevelclassService } from './levelclass.service';
import { CreateLevelclassDto } from './dto/create-levelclass.dto';
import {ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import { LevelClassDto } from './dto/level-class.dto';

@Controller('levelclass')
@ApiTags('Level-ClassApis')
export class LevelclassController {
  constructor(private readonly levelclassService: LevelclassService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async insertData(@Body() data: LevelClassDto) {
    await this.levelclassService.createLevelClass(data);
    return { message: 'Data inserted successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.levelclassService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/lvl/:id')
  findLevelByclass(@Param('id') id: string) {
    return this.levelclassService.getLevelClassesWithLevel(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.levelclassService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Body() updateLevelclassDto) {
    return this.levelclassService.update(updateLevelclassDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelclassService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/class/:branchId')
 async findClassesByBranchId(@Param('branchId') branchId: number):Promise<any> {
    return await this.levelclassService.fetchClassesByBranchId(branchId);
  }
  
}
