import { Module } from '@nestjs/common';
import { ExamInfoService } from './exam-info.service';
import { ExamInfoController } from './exam-info.controller';
import { ExamsInfo } from './exam-info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ExamsInfo])],
  controllers: [ExamInfoController],
  providers: [ExamInfoService],
})
export class ExamInfoModule { }
