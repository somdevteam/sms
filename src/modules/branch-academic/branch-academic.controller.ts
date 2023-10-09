import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { BranchAcademicService } from './branch-academic.service';
import { AcademicBranchDto } from './dto/create-branch-academic.dto';
import { AcademicBranch } from './entities/branch-academic.entity';
import { ApiBaseResponse } from 'src/common/dto/apiresponses.dto';

@Controller('branch-academic')
export class BranchAcademicController {
  constructor(private readonly branchAcademicService: BranchAcademicService) {}

  @Post()
 async create(@Body() createBranchAcademicDto: AcademicBranchDto): Promise<ApiBaseResponse> {
    const data = await this.branchAcademicService.createAcademicBranch(createBranchAcademicDto);
    return new ApiBaseResponse('created successfully',HttpStatus.OK,data);
  }

  @Get()
  findAll() {
    return this.branchAcademicService.findLatestActiveBranchAcademic(1);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchAcademicService.findOne(+id);
  }

  @Get('academic/:academicId')
  async getBranchesWithAcademicByAcademicId(@Param('academicId') academicId: number): Promise<ApiBaseResponse> {
    const branchAcademics = await this.branchAcademicService.findBranchesWithAcademicByAcademicId(academicId);
    return new ApiBaseResponse('branches by academic',HttpStatus.OK,branchAcademics);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBranchAcademicDto: AcademicBranchDto) {
    return this.branchAcademicService.update(+id, updateBranchAcademicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchAcademicService.remove(+id);
  }
}
