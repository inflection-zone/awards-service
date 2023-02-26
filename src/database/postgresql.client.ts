
import { Client } from 'pg';
import { logger } from '../logger/logger';
import { Config } from './database.config';

////////////////////////////////////////////////////////////////

export class PostgresqlClient {

    public static createDb = async () => {
        try {
            const query = `CREATE DATABASE ${Config.database}`;
            await PostgresqlClient.executeQuery(query);
        } catch (error) {
            logger.error(error.message);
        }
    };

    public static dropDb = async () => {
        try {
            const query = `DROP DATABASE IF EXISTS ${Config.database}`;
            await PostgresqlClient.executeQuery(query);
        } catch (error) {
            logger.error(error.message);
        }
    };

    public static executeQuery = async (query) => {
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
        } catch (error) {
            logger.error(error.message);
        }
    };

}
