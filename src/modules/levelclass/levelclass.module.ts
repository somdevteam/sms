import { Module } from '@nestjs/common';
import { LevelclassService } from './levelclass.service';
import { LevelclassController } from './levelclass.controller';

@Module({
  controllers: [LevelclassController],
  providers: [LevelclassService]
})
export class LevelclassModule {}
