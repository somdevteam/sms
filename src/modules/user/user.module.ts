import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {UserEntity} from "./user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserProfile} from "./userprofile.entity";
import {Loginhistories} from "../auth/loginhistories.entity";
import {RolePermissionsModule} from "../rolePermissions/rolePermissions.module";
import {UserPermissionsGuard} from "../../common/guards/userPermission.guards";
import { UserRolesModule } from '../userroles/userroles.module';
import { Permission } from '../permissions/entities/permissions.entity';
import { Menus } from '../menus/entities/menus.entity';
@Module({
  imports:[TypeOrmModule.forFeature([UserEntity,UserProfile,Loginhistories,Permission,Menus]),
  RolePermissionsModule,forwardRef(() =>UserRolesModule)],
  controllers: [UserController],
  providers: [UserService, UserEntity, UserPermissionsGuard],
  exports:[UserService]
})
export class UserModule {}
