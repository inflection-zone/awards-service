
import { Client } from 'pg';
import { logger } from '../../logger/logger';
import { Config } from '../database.config';
import IDbClient from './db.client.interface';

////////////////////////////////////////////////////////////////

export class PostgresqlClient implements IDbClient {

    public createDb = async () => {
        try {
            const query = `CREATE DATABASE ${Config.database}`;
            await this.executeQuery(query);
        } catch (error) {
            logger.error(error.message);
        }
    };

    public dropDb = async () => {
        try {
            const query = `DROP DATABASE IF EXISTS ${Config.database}`;
            await this.executeQuery(query);
        } catch (error) {
            logger.error(error.message);
        }
    };

    public executeQuery = async (query: string): Promise<unknown> => {
        try {
            const client = new Client({
                user     : Config.username,
                host     : Config.host,
                password : Config.password,
                port     : 5432,
            });
            await client.connect();
            await client.query(query);
            await client.end();
            return true;
        } catch (error) {
            logger.error(error.message);
            return false;
        }
    };

}
