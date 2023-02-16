import * as dotenv from 'dotenv';
import logger from "../logger/logger";

/////////////////////////////////////////////////////////////////////////////

export type databaseDialect = 'mysql' | 'postgres';

export interface DatabaseConfig {
    username: string;
    password: string;
    database: string;
    host    : string;
    port    : number;
    dialect : databaseDialect,
    pool    : {
        max    : 20,
        min    : 0,
        acquire: 30000,
        idle   : 10000,
    },
}

/////////////////////////////////////////////////////////////////////////////

if (typeof process.env.NODE_ENV === 'undefined') {
    dotenv.config();
}

if (process.env.NODE_ENV === 'test') {
    logger.log('info', '================================================');
    logger.log('info', 'Environment   : ' + process.env.NODE_ENV);
    logger.log('info', 'Database name : ' + process.env.DB_NAME);
    logger.log('info', 'Database user : ' + process.env.DB_USER_NAME);
    logger.log('info', 'Database host : ' + process.env.DB_HOST);
    logger.log('info', '================================================');
}

export const Config : DatabaseConfig = {
    username : process.env.DB_USER_NAME,
    password : process.env.DB_USER_PASSWORD,
    database : process.env.DB_NAME,
    host     : process.env.DB_HOST,
    port     : parseInt(process.env.DB_PORT),
    dialect  : process.env.DB_DIALECT as databaseDialect,
    pool     : {
        max     : 20,
        min     : 0,
        acquire : 30000,
        idle    : 10000,
    },
};

