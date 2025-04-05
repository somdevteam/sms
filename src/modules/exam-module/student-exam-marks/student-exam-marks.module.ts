import { Module } from '@nestjs/common';
import { StudentExamMarksService } from './student-exam-marks.service';
import { StudentExamMarksController } from './student-exam-marks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentExamMarks } from './entities/student-exam-marks.entity';
import { ExamsInfo } from '../exams/entities/exam-info.entity';
import { ClassExam } from '../exams/entities/class-exam.entity';
import { ClassSubject } from 'src/modules/academicModule/class-subject/entities/class-subject.entity';
import { Exam } from '../exams/entities/exam.entity';
import { ClassSection } from 'src/modules/academicModule/class-section/entities/class-section.entity';
import { Student } from 'src/modules/studentModule/student/entities/student.entity';
import { Subject } from 'src/modules/academicModule/subject/entities/subject.entity';
import { AcademicBranch } from 'src/modules/branch-academic/entities/branch-academic.entity';
import { StudentClass } from 'src/modules/studentModule/student/entities/student-class.entity';
@Module({
  imports: [TypeOrmModule.forFeature([StudentExamMarks,Student,StudentClass,Exam,ExamsInfo,Subject,AcademicBranch])],
  controllers: [StudentExamMarksController],
  providers: [StudentExamMarksService],
})
export class StudentExamMarksModule {}
