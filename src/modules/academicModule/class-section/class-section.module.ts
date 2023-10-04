import { Module } from '@nestjs/common';
import { ClassSectionService } from './class-section.service';
import { ClassSectionController } from './class-section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSection } from './entities/class-section.entity';
import { ClassModule } from '../class/class.module';
import { SectionModule } from '../section/section.module';
import { BranchAcademicModule } from 'src/modules/branch-academic/branch-academic.module';

@Module({
  imports:[TypeOrmModule.forFeature([ClassSection]),ClassModule,SectionModule,BranchAcademicModule,],
  controllers: [ClassSectionController],
  providers: [ClassSectionService],
  exports : [ClassSectionService],
})
export class ClassSectionModule {}
