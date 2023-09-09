import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StudentClass} from "./entities/studentclass.entity";
import {StudentClassController} from "./studentclass.controller";
import {StudentClassService} from "./studentclass.service";
import {StudentModule} from "../student/student.module";
import {ClassSectionModule} from "../../academicModule/class-section/class-section.module";

@Module({
  imports:[TypeOrmModule.forFeature([StudentClass]), ClassSectionModule, forwardRef(()=>StudentModule)],
  controllers: [StudentClassController],
  providers: [StudentClassService],
  exports: [StudentClassService,TypeOrmModule]
})
export class StudentclassModule {}
