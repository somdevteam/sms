import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {LoginDto} from "./Dto/login.dto";
import {UserEntity} from "../user/user.entity";
import {Loginhistories} from "./loginhistories.entity";

@Injectable()
export class AuthService {
    constructor(private usersService: UserService,
                private jwtService: JwtService) {
    }

    async createToken(user: any, loginHistoryId:number) {
        const data = await this.usersService.fetchSpecificUserData(user.userId,loginHistoryId);
       // data.loginHistory = loginHistoryId;
        const payload = {user: data};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(username:string, password:string): Promise<UserEntity> {
        const user = await this.usersService.getByUsernameAndPass(
            username,
            password,
        );
        if (!user) {
         throw new NotFoundException("Unauthorized. please try again")
        }
        return user;
    }
     async getSinleUserInfo(userId:number)  {
        return await this.usersService.fetchSingleUsersFullData(userId);
     }

    async getUserInfo(request: any, user: any): Promise<Loginhistories> {
        const userAgent = request.headers['user-agent'];
        const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

        const loginHistoryInfo = {
            ip,
            browser: userAgent != null ? userAgent : '',
            userId: user.userId,
        }
        const loginHistoryId = await this.usersService.addLoginHisotry(loginHistoryInfo, user);

        return loginHistoryId;
    }
}
