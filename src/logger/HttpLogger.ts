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
    const ips = [
        request.header('x-forwarded-for') || request.socket.remoteAddress
    ];
    response.on('finish', () => {
        const elapsed = Date.now() - start;
        const txt = {
            method        : request.method,
            url           : request.originalUrl,
            params        : request.params,
            query         : request.query,
            client        : request ? request.currentClient : null,
            user          : request ? request.currentUser : null,
            context       : request ? request.context : null,
            statusCode    : response.statusCode,
            statusMessage : response.statusMessage,
            duration      : `${elapsed}ms`,
            headers       : request.headers,
            requestBody   : request.body,
            ips           : request && request.ips.length > 0 ? request.ips : ips,
            contentType   : response.type,
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
