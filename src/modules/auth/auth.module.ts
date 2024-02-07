import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UserModule} from "../user/user.module";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./local.strategy";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {RolePermissionsModule} from "../rolePermissions/rolePermissions.module";

@Module({
  imports:[UserModule, RolePermissionsModule,
    PassportModule.register({ defaultStrategy: 'local' }),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get('jwt.secret'),
          signOptions: { expiresIn: configService.get('jwt.expiresIn') },
        }),
        inject: [ConfigService],
      })

  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy, JwtStrategy, ConfigService],
  exports:[AuthService],
})
export class AuthModule {}
