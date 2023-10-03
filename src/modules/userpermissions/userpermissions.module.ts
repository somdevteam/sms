import { Module } from '@nestjs/common';
import { UserpermissionsController } from './userpermissions.controller';
import { UserpermissionsService } from './userpermissions.service';

@Module({
  controllers: [UserpermissionsController],
  providers: [UserpermissionsService]
})
export class UserpermissionsModule {}
