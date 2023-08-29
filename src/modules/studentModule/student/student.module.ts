import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import {ResponsibleService} from "../../academicModule/responsible/responsible.service";
import {ResponsibleModule} from "../../academicModule/responsible/responsible.module";

@Module({
  imports: [TypeOrmModule.forFeature([Student]), ResponsibleModule],
  controllers: [StudentController],
  providers: [StudentService],

})
export class StudentModule {}
