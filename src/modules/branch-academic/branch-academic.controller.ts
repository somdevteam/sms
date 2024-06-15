import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { BranchAcademicService } from './branch-academic.service';
import { AcademicBranchDto } from './dto/create-branch-academic.dto';
import { ApiBaseResponse } from 'src/common/dto/apiresponses.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('branch-academic')
export class BranchAcademicController {
  constructor(private readonly branchAcademicService: BranchAcademicService) { }

  @Post()
  async create(@Body() createBranchAcademicDto: AcademicBranchDto): Promise<ApiBaseResponse> {
    const data = await this.branchAcademicService.createAcademicBranch(createBranchAcademicDto);
    return new ApiBaseResponse('created successfully', HttpStatus.OK, data);
  }

  @Get()
  findAll() {
    return this.branchAcademicService.findActiveBranchAcademic(1);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchAcademicService.findOne(+id);
  }

  @Get('academic/:academicId')
  async getBranchesWithAcademicByAcademicId(@Param('academicId') academicId: number): Promise<ApiBaseResponse> {
    const branchAcademics = await this.branchAcademicService.findBranchesByAcademicId(academicId);
    return new ApiBaseResponse('branches by academic', HttpStatus.OK, branchAcademics);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBranchAcademicDto: AcademicBranchDto) {
    return this.branchAcademicService.update(+id, updateBranchAcademicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchAcademicService.remove(+id);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('academicsByBranch/:branchId')
  async findAcademicsByBranch(@Param('branchId') branchId: number): Promise<ApiBaseResponse> {
    const resp = await this.branchAcademicService.findAcademicByBranch(branchId)
    return new ApiBaseResponse(null, 200, resp);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('activate')
  async activeAndDeactivateBranchAcademic(@Body() payload: any): Promise<ApiBaseResponse> {
    const resp = await this.branchAcademicService.activeAndDeactivateBranchAcademic(payload)
    return new ApiBaseResponse('successfully activated', 200, resp);
  }
}
