import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { Exam } from './exam.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchAcademicModule } from 'src/modules/branch-academic/branch-academic.module';
import { ExamsInfo } from './exam-info.entity';
import { ClassExam } from './class-exam.entity';
import { Class } from 'src/modules/academicModule/class/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, ExamsInfo,ClassExam,Class]), BranchAcademicModule],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule { }
