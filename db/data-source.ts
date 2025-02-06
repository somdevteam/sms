import {DataSource, DataSourceOptions} from "typeorm";

export const dataSourceOptions : DataSourceOptions ={
    type: 'mysql',
    host: 'localhost',
    username: 'root',
    password: 'mypassword',
    database: 'smsupdate',
    synchronize:true,
    //entities: [],
    //entities: ['dist/src/**/*.entity{.ts,.js}'],
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations:['dist/db/migrations/*.js']
}

const dataSource = new DataSource(dataSourceOptions);

export default  dataSource;
