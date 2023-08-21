export default () => ({
    database: {
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
        logging: process.env.DATABASE_SQL_LOGGING === 'true',

    },
    jwt: {
        secret: process.env.JWT_KEY,
        expiresIn: process.env.JWT_EXPIRATION,
    }
});
