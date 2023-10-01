import { Module } from '@nestjs/common';
import { BranchAcademicService } from './branch-academic.service';
import { BranchAcademicController } from './branch-academic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchAcademic } from './entities/branch-academic.entity';
import { BranchModule } from '../branch/branch.module';
import { AcademicModule } from '../academicModule/academic/academic.module';

@Module({
  imports:[TypeOrmModule.forFeature([BranchAcademic]),BranchModule,AcademicModule],
  controllers: [BranchAcademicController],
  providers: [BranchAcademicService,BranchAcademic],
})
export class BranchAcademicModule {}
