import { Module } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { AcademicController } from './academic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicEntity } from './entities/academic.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AcademicEntity])],
  controllers: [AcademicController],
  providers: [AcademicService,AcademicEntity]
})
export class AcademicModule {}
