import { Module } from '@nestjs/common';
import { ClassExamService } from './class-exam.service';
import { ClassExamController } from './class-exam.controller';
import { ClassExam } from './entities/class-exam.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsInfo } from '../exams/exam-info.entity';
import { Class } from 'src/modules/academicModule/class/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassExam, ExamsInfo, Class])],
  controllers: [ClassExamController],
  providers: [ClassExamService],
})
export class ClassExamModule { }
