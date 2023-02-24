// eslint-disable-next-line @typescript-eslint/no-var-requires
const mysql = require('mysql2');
import { logger } from '../logger/logger';
import { Config } from './database.config';

////////////////////////////////////////////////////////////////

export class MysqlClient {

    public static createDb = async () => {
        try {
            //var query = `CREATE DATABASE ${config.database} CHARACTER SET utf8 COLLATE utf8_general_ci;`;
            const query = `CREATE DATABASE ${Config.database}`;
            await MysqlClient.executeQuery(query);
            logger.info(`Database ${Config.database} created successfully!`);
        } catch (error) {
            logger.error(error.message);
        }
    };

    public static dropDb = async () => {
        try {
            const query = `DROP DATABASE IF EXISTS ${Config.database}`;
            await MysqlClient.executeQuery(query);
        } catch (error) {
            logger.error(error.message);
        }
    };

    public static executeQuery = (query): Promise<boolean> => {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            try {
                const connection = mysql.createConnection({
                    host     : Config.host,
                    user     : Config.username,
                    password : Config.password,
                });

                connection.connect(function (err) {
                    if (err) {
                        logger.error(err.message);
                        reject(err);
                    }

                    //logger.log('Connected!');
                    connection.query(query, function (err, result) {
                        if (err) {
                            logger.error(err.message);

                            var str = (result !== undefined && result !== null) ? result.toString() : null;
                            if (str != null) {
                                logger.error(str);
                            }
                            else {
                                logger.error(`Query: ${query}`);
                            }
                            reject(err);
                        }
                        resolve(true);
                    });
                });

            }
            catch (error) {
                logger.error(error.message);
            }
        });

    };

}
