// eslint-disable-next-line @typescript-eslint/no-var-requires
const mysql = require('mysql2');
import { logger } from '../../logger/logger';
import { Config } from '../../database/database.config';

////////////////////////////////////////////////////////////////

export default class FactsDbClient {

    public static createDatabase = async () => {
        try {
            const database = `awards_facts`;
            const query = `CREATE DATABASE ${database}`;
            await FactsDbClient.executeQuery(query);
            logger.info(`Database ${database} created successfully!`);
        } catch (error) {
            logger.error(error.message);
        }
    };

    private static executeQuery = (query): Promise<unknown> => {

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