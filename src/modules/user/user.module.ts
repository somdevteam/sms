import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {UserEntity} from "./user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserProfile} from "./userprofile.entity";
import {Loginhistories} from "../auth/loginhistories.entity";

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity,UserProfile,Loginhistories])],
  controllers: [UserController],
  providers: [UserService, UserEntity],
  exports:[UserService]
})
export class UserModule {}
