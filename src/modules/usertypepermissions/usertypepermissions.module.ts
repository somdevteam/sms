import { Module } from '@nestjs/common';
import { UsertypepermissionsController } from './usertypepermissions.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RolesEntity} from "../roles/entities/roles.entity";
import {UserTypePermissions} from "./usertypepermissions.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserTypePermissions])],
  controllers: [UsertypepermissionsController]
})
export class UsertypepermissionsModule {}
