import {Body, Controller, Get, Patch, Post, UseGuards} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {UserDto} from "../user/Dto/user.dto";
import {UserEntity} from "../user/user.entity";
import {BranchService} from "./branch.service";
import {BranchDTO} from "./dto/branch.dto";

@Controller('branch')
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

    @Patch("/")
    async updateBranh(@Body() branchDto: BranchDTO) {
        return  await this.branchService.update(branchDto);
    }


}
