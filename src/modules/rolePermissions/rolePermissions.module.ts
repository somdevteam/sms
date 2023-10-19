import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionsController } from './rolePermissions.controller';
import { RolePermissionsService } from './rolePermissions.service';
import { RolePermissionsEntity } from './entities/rolePermissions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermissionsEntity])],
  controllers: [RolePermissionsController],
  providers: [RolePermissionsService],
  exports:[RolePermissionsService,TypeOrmModule]
})
export class RolePermissionsModule {}
