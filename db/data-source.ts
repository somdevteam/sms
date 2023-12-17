import {DataSource, DataSourceOptions} from "typeorm";

export const dataSourceOptions : DataSourceOptions ={
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    //entities: [],
    //entities: ['dist/src/**/*.entity{.ts,.js}'],
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations:['dist/db/migrations/*.js']
}

const dataSource = new DataSource(dataSourceOptions);

export default  dataSource;
