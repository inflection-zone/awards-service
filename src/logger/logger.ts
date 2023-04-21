import { ConfigurationManager } from '../config/configuration.manager';
import { ILogger } from './logger.interface';
import { CustomDebugLogger } from './custom/custom.debug.logger';
import { CustomProdLogger } from './custom/custom.prod.logger';
import { BunyanDebugLogger } from './bunyan/bunyan.debug.logger';
import { BunyanProdLogger } from './bunyan/bunyan.prod.logger';
import { PinoDebugLogger } from './pino/pino.debug.logger';
import { PinoProdLogger } from './pino/pino.prod.logger';
import { WinstonDebugLogger } from './winston/winston.debug.logger';
import { WinstonProdLogger } from './winston/winston.prod.logger';

///////////////////////////////////////////////////////////

class Logger {

    static getLogger = (): ILogger => {

        const provider = ConfigurationManager.Logger;
        var logger_: ILogger = new CustomDebugLogger();

        if (provider === 'Winston') {
            logger_ = new WinstonDebugLogger();
            if (process.env.NODE_ENV === 'production') {
                logger_ = new WinstonProdLogger();
            }
        }
        if (provider === 'Bunyan') {
            logger_ = new BunyanDebugLogger();
            if (process.env.NODE_ENV === 'production') {
                logger_ = new BunyanProdLogger();
            }
        }
        if (provider === 'Pino') {
            logger_ = new PinoDebugLogger();
            if (process.env.NODE_ENV === 'production') {
                logger_ = new PinoProdLogger();
            }
        }
        if (provider === 'Custom') {
            logger_ = new CustomDebugLogger();
            if (process.env.NODE_ENV === 'production') {
                logger_ = new CustomProdLogger();
            }
        }
        return logger_;
    };

    static _logger: ILogger = this.getLogger();

    static info = (str: string) => {
        this._logger?.info(str);
    };

    static error = (str: string) => {
        this._logger?.error(str);
    };

    static warn = (str: string) => {
        this._logger?.warn(str);
    };

    static debug = (str: string) => {
        this._logger?.debug(str);
    };

}

export { Logger as logger };
