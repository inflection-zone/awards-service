import bunyan from 'bunyan';
import { AbstrctBunyanLogger } from './abstract.bunyan.logger';

///////////////////////////////////////////////////////////////////////

export class BunyanProdLogger extends AbstrctBunyanLogger {

    constructor() {
        super();

        this._logger = bunyan.createLogger({
            name    : 'default',
            streams : [
                {
                    level : 'debug',
                    path  : this._logFile,
                },
                {
                    level  : 'info',
                    stream : process.stdout,
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
