import {Body, Controller, Get, NotFoundException, Post, UseGuards, Request, Req} from '@nestjs/common';
import {LoginDto} from "./Dto/login.dto";
import {AuthGuard} from "@nestjs/passport";
import {LocalAuthGuard} from "./local-auth.guard";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { ApiBaseResponse } from "../../common/dto/apiresponses.dto";

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
    async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<any> {
        const user = await this.authService.validateUser(
            loginDto.username,
            loginDto.password,
        );

        if (!user.isActive) {
            return new ApiBaseResponse( 'User not found', 401, null);
        }
        const loginHistoryInfo = await this.authService.getUserInfo(req, user); // TODO
        const token = await this.authService.createToken(user, loginHistoryInfo.loginHistoryId);
        if (!token) {
            return new ApiBaseResponse( 'Unauthorized', 401, null);
        }
        return new ApiBaseResponse( 'Successfully Login', 200, token);
    }
}
