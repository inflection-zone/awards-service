//import cors from 'cors';
import "reflect-metadata";
import express from 'express';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import { Router } from './startup/router';
import { logger } from './logger/logger';
import { ConfigurationManager } from "./config/configuration.manager";
import { Loader } from './startup/loader';
import { Scheduler } from './startup/scheduler';
import { DbClient } from './database/db.clients/db.client';
import { Seeder } from './startup/seeder';
import { DBConnector } from "./database/database.connector";
import { FactsDBConnector } from "./modules/fact.extractors/facts.db.connector";
import { HttpLogger } from "./logger/HttpLogger";
import FactsDbClient from "./modules/fact.extractors/facts.db.client";

/////////////////////////////////////////////////////////////////////////

export default class Application {

    //#region Member variables

    public _app: express.Application = null;

    private _router: Router = null;

    private static _instance: Application = null;

    //#endregion

    private constructor() {
        this._app = express();
        this._router = new Router(this._app);
    }

    public static instance(): Application {
        return this._instance || (this._instance = new this());
    }

    public app(): express.Application {
        return this._app;
    }

    warmUp = async () => {
        try {
            await this.setupDatabaseConnection();
            await Loader.init();
            await this.setupMiddlewares();
            await this._router.init();
            const seeder = new Seeder();
            await seeder.seed();
            await Scheduler.instance().schedule();
        }
        catch (error) {
            logger.error('An error occurred while warming up.' + error.message);
        }
    };

    setupDatabaseConnection = async () => {
        if (process.env.NODE_ENV === 'test') {
            //Note: This is only for test environment
            //Drop all tables in db
            await DbClient.dropDatabase();
        }
        await DbClient.createDatabase();
        await DBConnector.initialize();

        await FactsDbClient.createDatabase();
        await FactsDBConnector.initialize();
    };

    public start = async(): Promise<void> => {
        try {
            await this.warmUp();
            await this.listen();
        }
        catch (error){
            logger.error('An error occurred while starting reancare-api service.' + error.message);
        }
    };

    private setupMiddlewares = async (): Promise<boolean> => {

        return new Promise((resolve, reject) => {
            try {
                this._app.use(express.urlencoded({ extended: true }));
                this._app.use(express.json());
                this._app.use(helmet());
                //this._app.use(cors());
                if (ConfigurationManager.UseHTTPLogging) {
                    HttpLogger.use(this._app);
                }

                const MAX_UPLOAD_FILE_SIZE = ConfigurationManager.MaxUploadFileSize;

                this._app.use(fileUpload({
                    limits            : { fileSize: MAX_UPLOAD_FILE_SIZE },
                    preserveExtension : true,
                    createParentPath  : true,
                    parseNested       : true,
                    useTempFiles      : true,
                    tempFileDir       : '/tmp/uploads/'
                }));
                resolve(true);
            }
            catch (error) {
                reject(error);
            }
        });
    };

    private listen = () => {
        return new Promise((resolve, reject) => {
            try {
                const port = process.env.PORT;
                const server = this._app.listen(port, () => {
                    const serviceName = `${process.env.SERVICE_NAME}-[${process.env.NODE_ENV}]`;
                    logger.info(serviceName + ' is up and listening on port ' + process.env.PORT.toString());
                    this._app.emit("server_started");
                });
                module.exports.server = server;
                resolve(this._app);
            }
            catch (error) {
                reject(error);
            }
        });
    };

}

// process.on('exit', () => {
//     logger.info("process.exit() is called.");
// });

[
    `exit`,
    `SIGINT`,
    `SIGUSR1`,
    `SIGUSR2`,
    `uncaughtException`,
    `SIGTERM`
].forEach((terminationEvent) => {
    process.on(terminationEvent, () => {
        logger.info(`Received ${terminationEvent} signal`);
        process.exit(0);
    });
});
