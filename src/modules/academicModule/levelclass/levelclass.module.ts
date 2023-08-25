import { Module } from '@nestjs/common';
import { LevelclassService } from './levelclass.service';
import { LevelclassController } from './levelclass.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Levelclass} from "./entities/levelclass.entity";
import {BranchModule} from "../branch/branch.module";
import { LevelModule } from '../level/level.module';
import { ClassModule } from '../class/class.module';

@Module({
  imports:[TypeOrmModule.forFeature([Levelclass]),BranchModule,LevelModule,ClassModule],
  controllers: [LevelclassController],
  providers: [LevelclassService]
})
export class LevelclassModule {}
