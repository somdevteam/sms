import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TabPermissionsController } from './tabPermissions.controller';
import { TabPermissionsService } from './tabPermissions.service';
import { TabPermission } from './entities/tabPermissions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TabPermission])],
  controllers: [TabPermissionsController],
  providers: [TabPermissionsService],
  exports:[TabPermissionsService,TypeOrmModule]
})
export class TabPermissionsModule {}
