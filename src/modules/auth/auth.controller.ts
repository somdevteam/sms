import {Body, Controller, Get, NotFoundException, Post, UseGuards, Request, Req} from '@nestjs/common';
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
    async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<any> {
        const user = await this.authService.validateUser(
            loginDto.username,
            loginDto.password,
        );

        if (!user){
            return "user not found";
        }
        var loginHistoryInfo = await this.authService.getUserInfo(req, user); // TODO
        const token = this.authService.createToken(user);
        this.getrequest(req);
        return token;
    }

    getrequest (req){
        console.log(req);
    }

}
