import path from 'path';
import fs from 'fs';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ILogger } from '../logger.interface';

///////////////////////////////////////////////////////////////////////

export abstract class AbstrctWinstonLogger implements ILogger {

    //#region  Privates

    protected _folder: string = path.join(__dirname, '../../../logs');

    protected _logFileName = 'debug.log';

    protected _logFile: string = path.join(this._folder, this._logFileName);

    protected _dailyRotateFile: DailyRotateFile = new DailyRotateFile({
        filename      : path.join(this._folder, 'application-%DATE%.log'),
        datePattern   : 'YYYY-MM-DD-HH',
        zippedArchive : true,
        maxSize       : '30m',
        maxFiles      : '14d',
        dirname       : this._folder,
    });

    //Use own format instead of json
    protected _customFormat: winston.Logform.Format = winston.format.printf(
        ({ level, message, timestamp }) => {
            return `${timestamp} ${level}: ${message}`;
        });

    protected _logger: winston.Logger = null;

    protected _logLevels = {
        fatal : 0,
        error : 1,
        warn  : 2,
        info  : 3,
        debug : 4,
        trace : 5,
    };

    //#endregion

    constructor() {
        if (!fs.existsSync(this._folder)) {
            fs.mkdirSync(this._folder);
        }
    }

    abstract info(str: string);

    abstract error(str: string);

    abstract warn(str: string);

    abstract debug(str: string);

}
