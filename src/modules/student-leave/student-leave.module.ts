import { Module } from '@nestjs/common';
import { StudentLeaveService } from './student-leave.service';
import { StudentLeaveController } from './student-leave.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StudentLeave} from "./entities/student-leave.entity";
import {StudentService} from "../studentModule/student/student.service";
import {StudentModule} from "../studentModule/student/student.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentLeave]),
    StudentModule,
  ],
  controllers: [StudentLeaveController],
  providers: [StudentLeaveService,],  //StudentService],
})
export class StudentLeaveModule {}
