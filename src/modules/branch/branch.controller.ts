import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {UserDto} from "../user/Dto/user.dto";
import {UserEntity} from "../user/user.entity";
import {BranchService} from "./branch.service";
import {BranchDTO} from "./dto/branch.dto";
import { UpdateBranchDTO } from './dto/update-branch.dto';
import {ApiTags} from "@nestjs/swagger";
import {ApiBaseResponse} from "../../common/dto/apiresponses.dto";

@Controller('branch')
@ApiTags('Branch Apis')
export class BranchController {
    constructor(private branchService: BranchService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get('/')
   async getAllBranches() {
       const allBranches = await this.branchService.getAllBranches();
        return new ApiBaseResponse('success', 200, allBranches);
    }

    @UseGuards(JwtAuthGuard)
    @Post("/")
   async createUser(@Body() branchDTO: BranchDTO) {
        const newBranch = await this.branchService.create(branchDTO);
        return new ApiBaseResponse('successfully Created', 200, newBranch);
    }

    @UseGuards(JwtAuthGuard)
    @Patch("/")
    async updateBranch(@Body() branchDto: UpdateBranchDTO) {
        const updateBranch = await this.branchService.update(branchDto);
        return  new ApiBaseResponse('successfully Updated', 200, updateBranch);
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
      const deletedBranch = await this.branchService.remove(+id);
    return new ApiBaseResponse('successfully Deleted', 200, deletedBranch);
}


}
