import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request, Res, UploadedFile,
  UseGuards, UseInterceptors
} from "@nestjs/common";

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BranchService } from './branch.service';
import { BranchDTO } from './dto/branch.dto';
import { UpdateBranchDTO } from './dto/update-branch.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiBaseResponse } from 'src/common/dto/apiresponses.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Observable, of } from "rxjs";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

       cb(null, `${filename}${extension}`)
    }
  })

}
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

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): ApiBaseResponse {
    let branchId = req.user.user.branchId;
    let  branchDto = new UpdateBranchDTO();
    branchDto.branchId = branchId ? branchId: 1;
    branchDto.branchLogo = file.filename;
    let users = this.branchService.update(branchDto);
    console.log(file);
    return file.filename;
    return new ApiBaseResponse('Success',200,file.filename)

 }
  @Get('branchlogo/:imagename')
  findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
    return of(res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename)));
  }


}
