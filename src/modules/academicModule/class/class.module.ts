import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Class} from "./entities/class.entity";
import { BranchAcademicModule } from 'src/modules/branch-academic/branch-academic.module';

@Module({
  imports:[TypeOrmModule.forFeature([Class]),BranchAcademicModule],
  controllers: [ClassController],
  providers: [ClassService,Class],
  exports:[ClassService]
})
export class ClassModule {}
