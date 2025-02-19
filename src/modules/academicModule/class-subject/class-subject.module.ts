import { Module } from '@nestjs/common';
import { ClassSubjectService } from './class-subject.service';
import { ClassSubjectController } from './class-subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSubject } from './entities/class-subject.entity';
import { Subject } from '../subject/entities/subject.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ClassSubject,Subject])],
  controllers: [ClassSubjectController],
  providers: [ClassSubjectService,ClassSubject]
})
export class ClassSubjectModule {}
