import { Module } from '@nestjs/common';
import { BranchAcademicService } from './branch-academic.service';
import { BranchAcademicController } from './branch-academic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchModule } from '../branch/branch.module';
import { AcademicModule } from '../academicModule/academic/academic.module';
import { AcademicBranch } from './entities/branch-academic.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AcademicBranch]),BranchModule,AcademicModule],
  controllers: [BranchAcademicController],
  providers: [BranchAcademicService,AcademicBranch],
  exports: [BranchAcademicService]
})
export class BranchAcademicModule {}
