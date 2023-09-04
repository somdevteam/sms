import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import {ResponsibleModule} from "../../academicModule/responsible/responsible.module";
import {StudentclassModule} from "../../academicModule/studentclass/studentclass.module";
import {ClassSectionModule} from "../../academicModule/class-section/class-section.module";

@Module({
  imports: [ResponsibleModule, TypeOrmModule,TypeOrmModule.forFeature([Student]),StudentclassModule, ClassSectionModule],
  controllers: [StudentController],
  providers: [StudentService],

})
export class StudentModule {}
