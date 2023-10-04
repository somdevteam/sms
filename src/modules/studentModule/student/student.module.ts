import {forwardRef, Module} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import {ResponsibleModule} from "../responsible/responsible.module";
import {StudentclassModule} from "../studentclass/studentclass.module";
import {ClassSectionModule} from "../../academicModule/class-section/class-section.module";
import { BranchAcademicModule } from 'src/modules/branch-academic/branch-academic.module';

@Module({
  imports: [ResponsibleModule, TypeOrmModule,TypeOrmModule.forFeature([Student]), ClassSectionModule,BranchAcademicModule,forwardRef(()=>StudentclassModule)],
  controllers: [StudentController],
  providers: [StudentService],
  exports : [StudentService]

})
export class StudentModule {}
