import winston from 'winston';
import { AbstrctPinoLogger } from './abstract.pino.logger';

///////////////////////////////////////////////////////////////////////

export class PinoDebugLogger extends AbstrctPinoLogger {

    constructor() {
        super();

        this._logger = winston.createLogger({
            levels : this._logLevels,
            level  : 'debug',
            format : winston.format.combine(
                winston.format.colorize(),
                //timestamp(),
                //this._customFormat,
                winston.format.json()
            ),
            transports : [
                // new winston.transports.File({ filename: logFile, level: 'silly' }),
                // new winston.transports.Console({
                //     handleExceptions : true,
                // }),
                this._dailyRotateFile,
            ]
        });
    }

    info = (str: string) => {
        this._logger?.info(str);
    };

    error = (str: string) => {
        this._logger?.error(str);
    };

    warn = (str: string) => {
        this._logger?.warn(str);
    };

    debug = (str: string) => {
        this._logger?.debug(str);
    };

}
