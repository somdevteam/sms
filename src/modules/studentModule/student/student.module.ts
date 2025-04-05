import {forwardRef, Module} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import { Responsible } from './entities/responsible.entity';
import { StudentClass } from './entities/student-class.entity';
import { ClassSectionModule } from 'src/modules/academicModule/class-section/class-section.module';
import { BranchAcademicModule } from 'src/modules/branch-academic/branch-academic.module';
import { StudentType } from './entities/student_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student,StudentClass,Responsible,StudentType]),ClassSectionModule,BranchAcademicModule],
  controllers: [StudentController],
  providers: [StudentService],
  exports : [StudentService]

})
export class StudentModule {}
