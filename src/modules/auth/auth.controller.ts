import {Body, Controller, Get, NotFoundException, Post, UseGuards} from '@nestjs/common';
import {LoginDto} from "./Dto/login.dto";
import {AuthGuard} from "@nestjs/passport";
import {LocalAuthGuard} from "./local-auth.guard";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto): Promise<any> {
        const user = await this.authService.validateUser(
            loginDto.username,
            loginDto.password,
        );

        if (!user){
            return "user not found";
        }
        const token = this.authService.createToken(user);
        return token;
    }

}
