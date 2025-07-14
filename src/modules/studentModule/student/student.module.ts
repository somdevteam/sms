import {forwardRef, Module} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import { StudentClass } from './entities/student-class.entity';
import { ClassSectionModule } from 'src/modules/academicModule/class-section/class-section.module';
import { BranchAcademicModule } from 'src/modules/branch-academic/branch-academic.module';
import { StudentType } from './entities/student_type.entity';
import { Guardian } from './entities/guardian.entity';
import { StudentAttendance } from './entities/student-attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student,StudentClass,Guardian,StudentType,StudentAttendance]),ClassSectionModule,BranchAcademicModule],
  controllers: [StudentController],
  providers: [StudentService],
  exports : [StudentService]

})
export class StudentModule {}
