import { logger } from '../logger/logger';
import { Logger, QueryRunner } from "typeorm";

export class DBLogger implements Logger {

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
