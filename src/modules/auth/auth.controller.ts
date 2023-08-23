import {Body, Controller, Get, NotFoundException, Post, UseGuards} from '@nestjs/common';
import {LoginDto} from "./Dto/login.dto";
import {AuthGuard} from "@nestjs/passport";
import {LocalAuthGuard} from "./local-auth.guard";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@Controller('auth')
@ApiTags('Authentication Apis')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {
    }

    @ApiResponse({status: 200, description: 'Login Completed'})
    @ApiResponse({status: 400, description: 'Bad Request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
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
