import {Body, Controller, Get, NotFoundException, Post, UseGuards, Request, Req, HttpStatus} from '@nestjs/common';
import {LoginDto} from "./Dto/login.dto";
import {AuthGuard} from "@nestjs/passport";
import {LocalAuthGuard} from "./local-auth.guard";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ApiBaseResponse} from "../../common/dto/apiresponses.dto";

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
    async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<ApiBaseResponse> {
        const user = await this.authService.validateUser(
            loginDto.username,
            loginDto.password,
        );

        if (!user){
            return new ApiBaseResponse("User not found",HttpStatus.NOT_FOUND,null);
        }
        var loginHistoryInfo = await this.authService.getUserInfo(req, user); // TODO
        const token = await this.authService.createToken(user, loginHistoryInfo.loginHistoryId);
        const users = {
            id: user.userId,
        img: null,
        username: user.username,
        password :user.password,
        firstName: user.username,
        lastName: user.username,
        role : 'Admin',
        branchId: null,
        token: token.access_token
        }
        return new ApiBaseResponse("Login Successfully",HttpStatus.OK,users);
    }


}
