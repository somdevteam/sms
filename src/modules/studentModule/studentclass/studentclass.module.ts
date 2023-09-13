import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StudentClass} from "./entities/studentclass.entity";
import {StudentClassController} from "./studentclass.controller";
import {StudentClassService} from "./studentclass.service";
import {StudentModule} from "../student/student.module";
import {ClassSectionModule} from "../../academicModule/class-section/class-section.module";
import { AcademicModule } from 'src/modules/academicModule/academic/academic.module';
import { BranchModule } from 'src/modules/branch/branch.module';
import { ClassModule } from 'src/modules/academicModule/class/class.module';
import { SectionModule } from 'src/modules/academicModule/section/section.module';

@Module({
  imports:[TypeOrmModule.forFeature([StudentClass]), ClassSectionModule,AcademicModule,BranchModule,ClassModule,SectionModule, forwardRef(()=>StudentModule)],
  controllers: [StudentClassController],
  providers: [StudentClassService,StudentClass],
  exports: [StudentClassService,TypeOrmModule]
})
export class StudentclassModule {}
