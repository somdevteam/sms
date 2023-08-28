import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Section} from "./entities/section.entity";

@Module({
  imports:[TypeOrmModule.forFeature([Section])],
  controllers: [SectionController],
  providers: [SectionService,Section],
  exports:[SectionService]
})
export class SectionModule {}
