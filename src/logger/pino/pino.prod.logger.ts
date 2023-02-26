import pino from 'pino';
import { AbstrctPinoLogger } from './abstract.pino.logger';

///////////////////////////////////////////////////////////////////////

export class PinoProdLogger extends AbstrctPinoLogger {

    constructor() {
        super();

        this._logger = pino({
            transport : {
                target : 'pino-pretty',
                //target : this._logFile
            },
            options : {
                translateTime : 'SYS:dd-mm-yyyy HH:MM:ss',
                ignore        : 'pid',
            }
        }
        //, pino.destination(this._logFile) // Another way to specify logfile
        );
        this._logger = pino({
            level   : 'warn',
            // transport : {
            //     target : 'pino-pretty',
            //     //target : this._logFile
            // },
            options : {
                append          : true,
                colorizeObjects : true,
                colorize        : true,
                //translateTime   : false,
                //timestampKey    : 'time',
                ignore          : 'pid',
            }
        }
        //, pino.destination(this._logFile) // Another way to specify logfile
        );
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
