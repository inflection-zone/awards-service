import "reflect-metadata";
import { Config } from './database.config';
import { logger } from '../logger/logger';
import { DataSource, Logger, QueryRunner } from "typeorm";

///////////////////////////////////////////////////////////////////////////////////

logger.info(`environment : ${process.env.NODE_ENV}`);
logger.info(`db name     : ${Config.database}`);
logger.info(`db username : ${Config.username}`);
logger.info(`db host     : ${Config.host}`);

class DBLogger implements Logger {

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        logger.info(`query: ${query}, params: ${JSON.stringify(parameters)}`);
    }

    logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        logger.error(`Error: ${JSON.stringify(error)}, query: ${query}, params: ${JSON.stringify(parameters)}`);
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        logger.warn(`Slow Query -> time: ${time.toFixed()}, query: ${query}, params: ${JSON.stringify(parameters)}`);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
        logger.info(`Schema Build -> ${message}`);
    }

    logMigration(message: string, queryRunner?: QueryRunner) {
        logger.info(`Migrations -> ${message}`);
    }

    log(level: "warn" | "info" | "log", message: any, queryRunner?: QueryRunner) {
        if (level === 'warn') {
            logger.warn(message);
        }
        else {
            logger.info(message);
        }
    }

}

class DatabaseConnector {

    static _source = new DataSource({
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
        //logger      : 'advanced-console', //Use console for the typeorm logging
        logger      : new DBLogger(),
        logging     : true,
        poolSize    : Config.pool.max,
        cache       : true,
    });

    static initialize = () => {
        this._source
            .initialize()
            .then(() => {
                logger.info('Database connection has been established successfully.');
            })
            .catch(error => {
                logger.error('Unable to connect to the database:' + error.message);
            });
    };

}

///////////////////////////////////////////////////////////////////////////////////

const Source = DatabaseConnector._source;

export { DatabaseConnector as DBConnector, Source };
