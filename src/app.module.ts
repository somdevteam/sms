import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "./modules/auth/auth.module";
import {BranchModule} from "./modules/branch/branch.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import configuration from "./config/configuration";
import {ClassModule} from "./modules/academicModule/class/class.module";
import {SubjectModule} from "./modules/academicModule/subject/subject.module";
import {LevelModule} from "./modules/academicModule/level/level.module";
import {LevelclassModule} from "./modules/academicModule/levelclass/levelclass.module";
import {AcademicModule} from "./modules/academicModule/academic/academic.module";
import { ClassSubjectModule } from './modules/academicModule/class-subject/class-subject.module';
import { ClassSectionModule } from './modules/academicModule/class-section/class-section.module';
import { SectionModule } from './modules/academicModule/section/section.module';
import {StudentModule} from "./modules/studentModule/student/student.module";
import {ResponsibleModule} from "./modules/studentModule/responsible/responsible.module";
import {StudentclassModule} from "./modules/studentModule/studentclass/studentclass.module";
import { BranchAcademicModule } from './modules/branch-academic/branch-academic.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        username: configService.get('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        logging: configService.get('database.logging'),
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule, AuthModule, BranchModule,
  ClassModule, SubjectModule, LevelModule, 
  LevelclassModule, AcademicModule, ClassSubjectModule,
  SectionModule,ClassSectionModule,StudentModule,
  ResponsibleModule, StudentclassModule,BranchAcademicModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
