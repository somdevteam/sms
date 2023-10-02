import { Module } from '@nestjs/common';
import { UserpermissionsController } from './userpermissions.controller';

@Module({
  controllers: [UserpermissionsController]
})
export class UserpermissionsModule {}
