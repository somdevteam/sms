import { Module } from '@nestjs/common';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../user/user.entity";
import {Branch} from "./branch.entity";
import { AccountingModule } from '../accounting/accounting.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Branch]),
    AccountingModule
  ],
  controllers: [BranchController],
  providers: [BranchService,Branch],
  exports:[BranchService]
})
export class BranchModule {}
