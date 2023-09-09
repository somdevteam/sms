import { Module } from '@nestjs/common';
import { ClassSectionService } from './class-section.service';
import { ClassSectionController } from './class-section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSection } from './entities/class-section.entity';
import { BranchModule } from '../../branch/branch.module';
import { ClassModule } from '../class/class.module';
import { SectionModule } from '../section/section.module';
import { AcademicModule } from '../academic/academic.module';

@Module({
  imports:[TypeOrmModule.forFeature([ClassSection]),BranchModule,ClassModule,SectionModule,AcademicModule,],
  controllers: [ClassSectionController],
  providers: [ClassSectionService],
  exports : [ClassSectionService],
})
export class ClassSectionModule {}
