import { Module } from '@nestjs/common';
import { ExamInfoService } from './exam-info.service';
import { ExamInfoController } from './exam-info.controller';
import { ExamsInfo } from './exam-info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchAcademicModule } from 'src/modules/branch-academic/branch-academic.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExamsInfo]),BranchAcademicModule],
  controllers: [ExamInfoController],
  providers: [ExamInfoService],
})
export class ExamInfoModule { }
