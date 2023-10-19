import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypesService } from './userTypes.service';
import { UserTypesController } from './userTypes.controller';
import { UserTypesEntity } from './entities/userTypes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserTypesEntity])],
  controllers: [UserTypesController],
  providers: [UserTypesService],
  exports: [UserTypesService, TypeOrmModule]
})
export class UserTypesModule {}
