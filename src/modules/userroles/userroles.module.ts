import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRolesEntity } from './entities/userroles.entity';
import { UserRolesService } from './userroles.service';
import { UserRolesController } from './userroles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserRolesEntity])],
  controllers: [UserRolesController],
  providers: [UserRolesService],
  exports: [UserRolesService, TypeOrmModule]
})
export class UserRolesModule {}
