import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {UserEntity} from "./user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserProfile} from "./userprofile.entity";
import {Loginhistories} from "../auth/loginhistories.entity";
import {RolePermissionsModule} from "../rolePermissions/rolePermissions.module";
import {UserPermissionsGuard} from "../../common/guards/userPermission.guards";

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity,UserProfile,Loginhistories]),RolePermissionsModule],
  controllers: [UserController],
  providers: [UserService, UserEntity, UserPermissionsGuard],
  exports:[UserService]
})
export class UserModule {}
