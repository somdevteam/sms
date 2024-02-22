import {DataSource, DataSourceOptions} from "typeorm";

export const dataSourceOptions : DataSourceOptions ={
    type: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: 'Isma@1234@$',
    database: 'sms',
    synchronize:true,
    //entities: [],
    //entities: ['dist/src/**/*.entity{.ts,.js}'],
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations:['dist/db/migrations/*.js']
}

const dataSource = new DataSource(dataSourceOptions);

export default  dataSource;
