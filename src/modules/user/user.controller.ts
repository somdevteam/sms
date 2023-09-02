import {Body, Controller, Get, Patch, Post, UseGuards, Request} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserDto} from "./Dto/user.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiTags} from "@nestjs/swagger";
import { ApiBaseResponse } from "../../common/dto/apiresponses.dto";

@Controller('user')
@ApiTags('User Apis')
export class UserController {
    constructor(private userService: UserService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get('/')
   async getAllUsers(@Request() req) {
        const allUsers = await this.userService.getAllUser(req.user.user);
        return new ApiBaseResponse('success', 200, allUsers);
    }

    @Post("/")
   async createUser(@Body() userDto: UserDto) {
        const newUser = await this.userService.create(userDto);
        return new ApiBaseResponse('success', 200, newUser);
    }

    @UseGuards(JwtAuthGuard)
    @Patch("/")
    async updateUser(@Body() userDto: UserDto): Promise<any> {
        const user = await this.userService.update(userDto);
        return new ApiBaseResponse('success', 200, user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/loggedInUser')
    getUser(@Request() req) {
        return "user " + JSON.stringify(req.user.user); //TODO: I think this is for testing
    }
}
