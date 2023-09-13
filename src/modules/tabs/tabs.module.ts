import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TabController } from './tabs.controller';
import { TabService } from './tabs.service';
import { Tab } from "./entities/tabs.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Tab])],
  controllers: [TabController],
  providers: [TabService],
  exports:[TabService,TypeOrmModule]
})
export class TabsModule {}
