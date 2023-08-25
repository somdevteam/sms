import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {UserDto} from "../user/Dto/user.dto";
import {UserEntity} from "../user/user.entity";
import {BranchService} from "./branch.service";
import {BranchDTO} from "./dto/branch.dto";
import { UpdateBranchDTO } from './dto/update-branch.dto';
import {ApiTags} from "@nestjs/swagger";

@Controller('branch')
@ApiTags('BranchApis')
export class BranchController {
    constructor(private branchService: BranchService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    getAllBranches() {
        return this.branchService.getAllBranches();
    }

    @UseGuards(JwtAuthGuard)
    @Post("/")
    createUser(@Body() branchDTO: BranchDTO) {
        return this.branchService.create(branchDTO);
    }

    @UseGuards(JwtAuthGuard)
    @Patch("/")
    async updateBranch(@Body() branchDto: UpdateBranchDTO) {
        return  await this.branchService.update(branchDto);
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
    return this.branchService.remove(+id);
}


}
