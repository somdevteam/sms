import { Module } from '@nestjs/common';
import { ClassExamService } from './class-exam.service';
import { ClassExamController } from './class-exam.controller';
import { ClassExam } from './entities/class-exam.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ClassExam])],
  controllers: [ClassExamController],
  providers: [ClassExamService],
})
export class ClassExamModule { }
