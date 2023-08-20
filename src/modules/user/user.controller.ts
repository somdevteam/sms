import {Body, Controller, Get, Patch, Post, UseGuards, Request} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserDto} from "./Dto/user.dto";
import {UserEntity} from "./user.entity";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiBaseResponse} from "../../common/dto/apiresponses.dto";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    getAllUsers(@Request() req) {
        return this.userService.getAllUser(req.user.user);
    }

    @Post("/")
    createUser(@Body() userDto: UserDto) {
        return this.userService.create(userDto);
    }

    @Patch("/")
    async updateUser(@Body() userDto: UserDto): Promise<any> {
        const user = await this.userService.update(userDto);
        console.log(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/loggedInUser')
    getUser(@Request() req) {
        return "user " + JSON.stringify(req.user.user);
    }
}
