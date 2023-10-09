import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDto } from '../user/Dto/user.dto';
import { UserEntity } from '../user/user.entity';
import { BranchService } from './branch.service';
import { BranchDTO } from './dto/branch.dto';
import { UpdateBranchDTO } from './dto/update-branch.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiBaseResponse } from 'src/common/dto/apiresponses.dto';

@Controller('branch')
@ApiTags('Branch Apis')
export class BranchController {
  constructor(private branchService: BranchService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':type?')
  async getAllBranches(
    @Request() req,
    @Param('type') type?: string,
  ): Promise<ApiBaseResponse> {
    const isAll = !type ? false : true;

    const branches = await this.branchService.getAllBranches(
      req.user.user,
      isAll,
    );
    return new ApiBaseResponse('branches list', HttpStatus.OK, branches);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createBranch(@Body() branchDTO: BranchDTO): Promise<ApiBaseResponse> {
    await this.branchService.create(branchDTO);
    return new ApiBaseResponse('branch saved', HttpStatus.OK, null);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/')
  async updateBranch(@Body() branchDto: UpdateBranchDTO) {
    return await this.branchService.update(branchDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':academicId/branches')
  async findAllBranchesWithAcademicInfo(
    @Param('academicId') academicId: number,
  ): Promise<ApiBaseResponse> {
    const branhes = await this.branchService.findBranchesWithCondition(
      academicId,
    );
    return new ApiBaseResponse('branches', HttpStatus.OK, branhes);
  }
}
