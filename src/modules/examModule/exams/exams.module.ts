import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { Exam } from './exam.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Exam])],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
