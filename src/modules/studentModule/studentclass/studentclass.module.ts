import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StudentClass} from "./entities/studentclass.entity";
import {StudentClassController} from "./studentclass.controller";
import {StudentClassService} from "./studentclass.service";

@Module({
  imports:[TypeOrmModule.forFeature([StudentClass])],
  controllers: [StudentClassController],
  providers: [StudentClassService],
  exports: [StudentClassService,TypeOrmModule]
})
export class StudentclassModule {}
