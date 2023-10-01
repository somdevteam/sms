import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BranchAcademicService } from './branch-academic.service';
import { UpdateBranchAcademicDto } from './dto/update-branch-academic.dto';
import { BranchAcademicDto } from './dto/create-branch-academic.dto';

@Controller('branch-academic')
export class BranchAcademicController {
  constructor(private readonly branchAcademicService: BranchAcademicService) {}

  @Post()
  create(@Body() createBranchAcademicDto: BranchAcademicDto) {
    return this.branchAcademicService.create(createBranchAcademicDto);
  }

  @Get()
  findAll() {
    return this.branchAcademicService.findAll();
  }

  @Get('me')
  findByBranchIdAndAcademicId(
    // @Param('branchId') branchId: number,
    // @Param('academicId') academicId: number,
  ) {
    return this.branchAcademicService.findByBranchIdAndAcademicId(1, 1);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchAcademicService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBranchAcademicDto: UpdateBranchAcademicDto) {
    return this.branchAcademicService.update(+id, updateBranchAcademicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchAcademicService.remove(+id);
  }
}
