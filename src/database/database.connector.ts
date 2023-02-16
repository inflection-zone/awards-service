import "reflect-metadata";
import { Config } from './database.config';
import logger from '../logger/logger';
import { DataSource } from "typeorm";

///////////////////////////////////////////////////////////////////////////////////

logger.log('info', `environment : ${process.env.NODE_ENV}`);
logger.log('info', `db name     : ${Config.database}`);
logger.log('info', `db username : ${Config.username}`);
logger.log('info', `db host     : ${Config.host}`);

const Source = new DataSource({
    name        : Config.dialect,
    type        : Config.dialect,
    host        : Config.host,
    port        : Config.port,
    username    : Config.username,
    password    : Config.password,
    database    : Config.database,
    synchronize : true,
    entities    : [__dirname + '/models/**/*{.js,.ts}'],
    migrations  : [],
    subscribers : [],
    logger      : 'advanced-console',
    logging     : true,
    poolSize    : Config.pool.max,
    cache       : true,
});

Source
    .initialize()
    .then(() => {
        logger.log('info', 'Database connection has been established successfully.');
    })
    .catch(error => {
        logger.error('Unable to connect to the database:' + error.message);
    });

///////////////////////////////////////////////////////////////////////////////////

export default Source;
