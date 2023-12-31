import {Body, Controller, Get, Patch, Post, UseGuards, Request, HttpStatus, Param} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserDto} from "./Dto/user.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiTags} from "@nestjs/swagger";
import { ApiBaseResponse } from 'src/common/dto/apiresponses.dto';
import { UserFilterDto } from './Dto/search-user.dto';
import { ResetPasswordDto } from './Dto/reset-password.dto';

@Controller('user')
@ApiTags('User Apis')
export class UserController {
    constructor(private userService: UserService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getAllUsers(@Request() req) :Promise<ApiBaseResponse>{
        const users = await this.userService.getAllUser(req.user.user);
        //return users;
        return new ApiBaseResponse('users',HttpStatus.OK,users)
    }
    

    @UseGuards(JwtAuthGuard)
    @Post("/")
    async createUser(@Body() userDto: UserDto): Promise<ApiBaseResponse> {
        const users = await this.userService.create(userDto);
        return new ApiBaseResponse('user created successfully',HttpStatus.OK,null)
    }

    @UseGuards(JwtAuthGuard)
    @Post("usersByFilter")
    async getUsersByFilter(@Body() userDto: UserFilterDto): Promise<ApiBaseResponse> {
        const usersList = await  this.userService.fetchUsersByBranch(userDto);
        return new ApiBaseResponse('users list',HttpStatus.OK,usersList);
    }

    @UseGuards(JwtAuthGuard)
    @Patch("resetpassword/:id")
    async resetPassword(@Param('id') id,@Body() payload: ResetPasswordDto): Promise<ApiBaseResponse> {
        const data = await  this.userService.resetPassword(id,payload);
        return new ApiBaseResponse('reset password success',HttpStatus.OK,null);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateUser(@Param('id') id,@Body() userDto: UserDto): Promise<ApiBaseResponse> {
        const user = await this.userService.update(id,userDto);
        return new ApiBaseResponse('updated successfully',HttpStatus.OK,null);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/loggedInUser')
    getUser(@Request() req) {
        return "user " + JSON.stringify(req.user.user);
    }
}
