import { Controller, Get, Post, Body, Patch, Param, Delete,Request } from '@nestjs/common';
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

  @Get('/lvl/:id')
  findLevelByclass(@Param('id') id: string) {
    // return 'yes works' + id;
    return this.levelclassService.getLevelClassesWithLevel(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.levelclassService.findOne(+id);
  }

  @Patch(':id')
  update(@Body() updateLevelclassDto) {
    return this.levelclassService.update(updateLevelclassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelclassService.remove(+id);
  }

  @Get('/class/:branchId')
 async findClassesByBranchId(@Param('branchId') branchId: number):Promise<any> {
    const user = null;
    console.log("user is reached"+branchId);
    console.log(branchId);
    return await this.levelclassService.fetchClassesByBranchId(branchId);
  }
  
}
