import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig :TypeOrmModuleOptions ={
    type: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: 'mypassword',
    database: 'sms',
    //entities: [],
     //entities: ['dist/src/**/*.entity{.ts,.js}'],
     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
}