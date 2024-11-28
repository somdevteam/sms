import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { Exam } from './exam.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchAcademicModule } from 'src/modules/branch-academic/branch-academic.module';
import { ExamsInfo } from './exam-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, ExamsInfo]), BranchAcademicModule],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule { }
