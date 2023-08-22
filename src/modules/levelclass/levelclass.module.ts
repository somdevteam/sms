import { Module } from '@nestjs/common';
import { LevelclassService } from './levelclass.service';
import { LevelclassController } from './levelclass.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Levelclass} from "./entities/levelclass.entity";
import {BranchModule} from "../branch/branch.module";

@Module({
  imports:[TypeOrmModule.forFeature([Levelclass]),BranchModule],
  controllers: [LevelclassController],
  providers: [LevelclassService]
})
export class LevelclassModule {}
