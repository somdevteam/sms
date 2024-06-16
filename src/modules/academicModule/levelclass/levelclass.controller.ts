import {Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, HttpStatus} from '@nestjs/common';
import { LevelclassService } from './levelclass.service';
import {ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import { LevelClassDto } from './dto/level-class.dto';
import { BranchLevel } from './dto/branch-class.dto';
import { ApiBaseResponse } from 'src/common/dto/apiresponses.dto';

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

  // @UseGuards(JwtAuthGuard)
  @Get('/lvl/:id')
  findLevelByclass(@Param('id') id: string) {
    return this.levelclassService.getLevelClassesWithLevel1(+id);
  }

  @Get('/levelbybranch/:id')
  async findLevelByBranch(@Param('id') id: string) : Promise<ApiBaseResponse> {
    const levels = await this.levelclassService.getLevelsByBranch(+id);
    return new ApiBaseResponse(null,HttpStatus.OK,levels)
  }

  @Post('/classbybranchandlevel')
  async findClassByBranchAndLevel(@Body() payload:BranchLevel) : Promise<ApiBaseResponse> {
    const levels = await this.levelclassService.getClassesByBranchAndLevel(payload);
    return new ApiBaseResponse(null,HttpStatus.OK,levels)
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
  async remove(@Param('id') id: number): Promise<ApiBaseResponse>  {
    await this.levelclassService.remove(id);
    return new ApiBaseResponse('deleted succesfuuly',HttpStatus.OK,null);
  }
  
}
