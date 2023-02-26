import { ConfigurationManager } from "../config/configuration.manager";
import { ILogger } from "./logger.interface";
import { CustomDebugLogger } from "./custom/custom.debug.logger";
import { CustomProdLogger } from "./custom/custom.prod.logger";
import { BunyanDebugLogger } from "./bunyan/bunyan.debug.logger";
import { BunyanProdLogger } from "./bunyan/bunyan.prod.logger";
import { PinoDebugLogger } from "./pino/pino.debug.logger";
import { PinoProdLogger } from "./pino/pino.prod.logger";
import { WinstonDebugLogger } from "./winston/winston.debug.logger";
import { WinstonProdLogger } from "./winston/winston.prod.logger";

///////////////////////////////////////////////////////////

const provider = ConfigurationManager.Logger;

class Logger {

    static _logger:ILogger = null;

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

if (provider === 'Winston') {
    Logger._logger = new WinstonDebugLogger();
    if (process.env.NODE_ENV === 'production') {
        Logger._logger = new WinstonProdLogger();
    }
}
else if (provider === 'Bunyan') {
    Logger._logger = new BunyanDebugLogger();
    if (process.env.NODE_ENV === 'production') {
        Logger._logger = new BunyanProdLogger();
    }
}
else if (provider === 'Pino') {
    Logger._logger = new PinoDebugLogger();
    if (process.env.NODE_ENV === 'production') {
        Logger._logger = new PinoProdLogger();
    }
}
else {
    Logger._logger = new CustomDebugLogger();
    if (process.env.NODE_ENV === 'production') {
        Logger._logger = new CustomProdLogger();
    }
}

export { Logger as logger };
