import {Body, Controller, Get, Patch, Post, UseGuards} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {UserDto} from "../user/Dto/user.dto";
import {UserEntity} from "../user/user.entity";
import {BranchService} from "./branch.service";
import {BranchDTO} from "./dto/branch.dto";
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@Controller('branch')
@ApiTags('branch')
export class BranchController {
    constructor(private branchService: BranchService) {
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get all users', description: 'Returns a list of all users.' })
    @Get('/')
    getAllUsers() {
        return this.branchService.getAllBranches();
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create User', description: 'Returns Created Users.' })
    @Post("/")
    createUser(@Body() branchDTO: BranchDTO) {
        return this.branchService.create(branchDTO);
    }


}
