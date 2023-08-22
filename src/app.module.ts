import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "./modules/auth/auth.module";
import {BranchModule} from "./modules/branch/branch.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import configuration from "./config/configuration";
import {ClassModule} from "./modules/class/class.module";
import {SubjectModule} from "./modules/subject/subject.module";
import {LevelModule} from "./modules/level/level.module";
import {LevelclassModule} from "./modules/levelclass/levelclass.module";
import {AcademicModule} from "./modules/academic/academic.module";


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
  ClassModule, SubjectModule, LevelModule, LevelclassModule, AcademicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
