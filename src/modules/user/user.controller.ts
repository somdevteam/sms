import {Body, Controller, Get, Patch, Post, UseGuards, Request, HttpStatus, Param} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserDto} from "./Dto/user.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiTags} from "@nestjs/swagger";
import { ApiBaseResponse } from 'src/common/dto/apiresponses.dto';

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
    createUser(@Body() userDto: UserDto) {
        return this.userService.create(userDto);
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
