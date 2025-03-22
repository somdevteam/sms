import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UserModule} from "../user/user.module";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./local.strategy";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";
import {RolePermissionsModule} from "../rolePermissions/rolePermissions.module";
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports:[UserModule, RolePermissionsModule,
    PassportModule.register({ defaultStrategy: 'local' }),
    JwtModule.register({
      secret: process.env.jwt_secret,
      signOptions: { expiresIn: process.env.jwt_expiresIn },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports:[AuthService],
})
export class AuthModule {}
