import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRolesEntity } from './entities/userroles.entity';
import { UserRolesService } from './userroles.service';
import { UserRolesController } from './userroles.controller';
import { RolesModule } from '../roles/roles.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserRolesEntity]),RolesModule,forwardRef(() => UserModule)],
  controllers: [UserRolesController],
  providers: [UserRolesService],
  exports: [UserRolesService, TypeOrmModule]
})
export class UserRolesModule {}
