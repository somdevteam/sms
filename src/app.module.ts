import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmConfig} from "./config/typeorm.config";
import {AuthModule} from "./modules/auth/auth.module";
import {BranchModule} from "./modules/branch/branch.module";
import { AcademicModule } from './modules/academic/academic.module';
import { LevelclassModule } from './modules/levelclass/levelclass.module';


@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig),UserModule, AuthModule, BranchModule,AcademicModule, LevelclassModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
