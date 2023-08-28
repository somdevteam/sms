import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Level} from "./entities/level.entity";

@Module({
  imports:[TypeOrmModule.forFeature([Level])],
  controllers: [LevelController],
  providers: [LevelService,Level],
  exports:[LevelService]
})
export class LevelModule {}
