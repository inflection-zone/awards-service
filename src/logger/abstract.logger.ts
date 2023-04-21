import path from 'path';
import fs from 'fs';
import { ILogger } from './logger.interface';

///////////////////////////////////////////////////////////////////////

export abstract class AbstrctLogger implements ILogger {

    //#region  Privates

    protected _folder: string = path.join(process.cwd(), 'logs');

    protected _logFileName = 'debug.log';

    protected _logFile: string = path.join(this._folder, this._logFileName);

    protected _logger = null;

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
