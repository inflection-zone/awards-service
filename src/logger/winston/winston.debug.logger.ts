import winston from 'winston';
import { AbstrctWinstonLogger } from './abstract.winston.logger';

///////////////////////////////////////////////////////////////////////

export class WinstonDebugLogger extends AbstrctWinstonLogger {

    constructor() {
        super();

        const format = winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.label({ label: `[${process.env.NODE_ENV}-${process.env.SERVICE_NAME}]` }),
            winston.format.timestamp({ format: 'YY-MM-DD HH:MM:SS' }),
            winston.format.printf(
                (x) =>
                    `${x.timestamp} ${x.label} ${x.level} : ${x.message}`
            )
        );

        winston.addColors({
            info  : 'blue',
            warn  : 'yellow',
            error : 'bold red',
            debug : 'green',
        });

        this._logger = winston.createLogger({
            levels     : this._logLevels,
            level      : 'debug',
            // format : winston.format.combine(
            //     winston.format.colorize({
            //         all : true
            //     }),
            //     winston.format.timestamp({
            //         format : `YY-MM-DD HH:mm:ss`
            //     }),
            //     this._customFormat,
            //     winston.format.json()
            // ),
            transports : [
                // new winston.transports.File({ filename: logFile, level: 'silly' }),
                new winston.transports.Console({
                    handleExceptions : true,
                    format
                }),
                //this._dailyRotateFile,
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
