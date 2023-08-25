import { Module } from '@nestjs/common';
import { ClassSubjectService } from './class-subject.service';
import { ClassSubjectController } from './class-subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSubject } from './entities/class-subject.entity';
import { BranchModule } from '../../branch/branch.module';
import { SubjectModule } from '../subject/subject.module';
import { ClassModule } from '../class/class.module';

@Module({
  imports:[TypeOrmModule.forFeature([ClassSubject]),BranchModule,ClassModule,SubjectModule],
  controllers: [ClassSubjectController],
  providers: [ClassSubjectService,ClassSubject]
})
export class ClassSubjectModule {}
