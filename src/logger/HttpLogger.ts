import express from 'express';
import { ConfigurationManager } from '../config/configuration.manager';
import * as pinoHttp from 'pino-http';
import { logger } from './logger';

//////////////////////////////////////////////////////////////////////////////

const expressLoggerFunc = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction) => {

    const start = Date.now();

    response.on('finish', () => {
        const elapsed = Date.now() - start;
        const txt = {
            method   : request.method,
            url      : request.originalUrl,
            status   : response.statusCode,
            duration : `${elapsed}ms`,
            headers  : request.headers,
            body     : request.body,
            response : response.json(),
            ips      : request.ip,
        };
        logger.info(JSON.stringify(txt, null, 2));
    });

    next();
};

export class HttpLogger {

    static use = (app: express.Application) => {

        const provider = ConfigurationManager.Logger;

        if (provider === 'Winston') {
            app.use(expressLoggerFunc);
        }
        else if (provider === 'Bunyan') {
            app.use(expressLoggerFunc);
        }
        else if (provider === 'Pino') {
            const logger: pinoHttp.HttpLogger = pinoHttp.pinoHttp();
            app.use(logger);
        }
        else {
            app.use(expressLoggerFunc);
        }
    };

}
