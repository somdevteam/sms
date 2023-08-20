import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UserModule} from "../user/user.module";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./local.strategy";
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./constants";
import {JwtStrategy} from "./jwt.strategy";

@Module({
  imports:[UserModule,
    PassportModule.register({ defaultStrategy: 'local' }),
      JwtModule.register({
        secret:jwtConstants.secret,
        signOptions: {expiresIn:'300s'}
      })

  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy, JwtStrategy],
  exports:[AuthService],
})
export class AuthModule {}
