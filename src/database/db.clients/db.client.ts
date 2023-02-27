import { MysqlClient } from './mysql.client';
import { PostgresqlClient } from './postgresql.client';
import { logger } from '../../logger/logger';
import { execSync } from 'child_process';
import IDbClient from './db.client.interface';

////////////////////////////////////////////////////////////////////////

export class DbClient {

    static _client: IDbClient = process.env.DB_DIALECT === 'postgres' ? new PostgresqlClient() : new MysqlClient();

    //Creates DB if does not exist
    public static createDatabase = async () => {
        try {
            await this._client.createDb();
            return true;
        } catch (error) {
            logger.error(error.message);
        }
        return false;
    };

    //Drops DB if exists
    public static dropDatabase = async () => {
        try {
            await this._client.dropDb();
            return true;
        } catch (error) {
            logger.error(error.message);
        }
        return false;
    };

    //Drops DB if exists
    public static executeQuery = async (query: string) => {
        try {
            await this._client.executeQuery(query);
            return true;
        } catch (error) {
            logger.error(error.message);
        }
        return false;
    };

    public static migrate = async () => {
        try {
            const output = execSync('npx sequelize-cli db:migrate');
            const str = output.toString();
            logger.info('Database migrated successfully!');
            logger.info(str);
            return true;
        } catch (error) {
            logger.error(error.message);
        }
        return false;
    };

}

////////////////////////////////////////////////////////////////////////
