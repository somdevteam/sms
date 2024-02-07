import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Post,
    UseGuards,
    Request,
    Req,
    HttpStatus,
    Param
} from '@nestjs/common';
import {LoginDto} from "./Dto/login.dto";
import {AuthService} from "./auth.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ApiBaseResponse} from "../../common/dto/apiresponses.dto";
import {RolePermissionsService} from "../rolePermissions/rolePermissions.service";

@Controller('auth')
@ApiTags('Authentication Apis')
export class AuthController {
    constructor(
        private authService: AuthService,
        private rolePermissionService: RolePermissionsService
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

        const userInfo = await this.authService.getSinleUserInfo(user.userId);
        console.log(userInfo);

        var loginHistoryInfo = await this.authService.getUserInfo(req, user); // TODO
        const token = await this.authService.createToken(user, loginHistoryInfo.loginHistoryId);

        const rolePermission = await this.rolePermissionService.findRolePermissionById(userInfo.roleId);
        const permissions = rolePermission.map(item => item["permissionName"]);
        console.log(rolePermission);
        const users = {
            id: user.userId,
            img: null,
            username: user.username,
            password: user.password,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            role: userInfo.roleName,
            roleId: userInfo.roleId,
            branch: userInfo.branchId,
            token: token.access_token,
            permissions: permissions
        }
        return new ApiBaseResponse("Login Successfully", HttpStatus.OK, users);
    }

    @Get('/:id')
    async findOne(@Param('id') roleId: number): Promise<ApiBaseResponse> {
        console.log(roleId);
        const userInfo = await this.authService.getSinleUserInfo(roleId);
        return new ApiBaseResponse('success', 200, userInfo);
    }

}
