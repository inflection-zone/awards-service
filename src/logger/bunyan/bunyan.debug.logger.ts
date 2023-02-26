import bunyan from 'bunyan';
import { AbstrctBunyanLogger } from './abstract.bunyan.logger';

///////////////////////////////////////////////////////////////////////

export class BunyanDebugLogger extends AbstrctBunyanLogger {

    constructor() {
        super();

        this._logger = bunyan.createLogger({
            name    : `[${process.env.NODE_ENV}-${process.env.SERVICE_NAME}]`,
            streams : [
                // {
                //     level : 'debug',
                //     path  : this._logFile,
                // },
                {
                    level  : 'info',
                    //stream : process.stdout,
                    stream : this._consolePrettyStream,
                    format : '[@time $level] $msg'
                }
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
