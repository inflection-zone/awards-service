/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Config } from './database.config';
import { logger } from '../logger/logger';
import { DataSource } from "typeorm";
import path from "path";
import fs from 'fs';
import { Client } from './models/client/client.model';
import { User } from './models/user/user.model';
import { AwardPointRedemption } from "./models/awards/award.points.redemption.model";
import { BadgeCategory } from "./models/awards/badge.category.model";
import { Badge } from "./models/awards/badge.model";
import { DisbursedAwardPoint } from "./models/awards/disbursed.award.point.model";
import { ParticipantGroup } from "./models/awards/participant.group.model";
import { ParticipantBadge } from "./models/awards/participant.badge.model";
import { Participant } from "./models/awards/participant.model";
import { Condition } from './models/engine/condition.model';
import { Context } from './models/engine/context.model';
import { IncomingEvent } from './models/engine/incoming.event.model';
import { IncomingEventType } from './models/engine/incoming.event.type.model';
import { Node } from './models/engine/node.model';
import { NodeInstance } from './models/engine/node.instance.model';
import { NodeDefaultAction } from './models/engine/node.default.action.model';
import { RuleAction } from './models/engine/rule.action.model';
import { Rule } from './models/engine/rule.model';
import { SchemaInstance } from './models/engine/schema.instance.model';
import { Schema } from './models/engine/schema.model';
import { FileResource } from "./models/general/file.resource.model";
import { Person } from './models/user/person.model';
import { UserLoginSession } from "./models/user/user.login.session.model";
import { Role } from "./models/user/role.model";
import { Privilege } from "./models/user/privilege.model";
import { SchemaEventType } from "./models/engine/schema.event.type.model";
import { DBLogger } from "./database.logger";
import { FileResourceVersion } from "./models/general/file.resource.version.model";
import { BadgeStockImage } from "./models/awards/badge.stock.image.model";

///////////////////////////////////////////////////////////////////////////////////

logger.info(`environment : ${process.env.NODE_ENV}`);
logger.info(`db name     : ${Config.database}`);
logger.info(`db username : ${Config.username}`);
logger.info(`db host     : ${Config.host}`);

///////////////////////////////////////////////////////////////////////////////////

class DatabaseConnector {

    static _basePath = path.join(process.cwd(), 'src/database/models').replace(/\\/g, '/');

    // static _folders = this.getFoldersRecursively(this._basePath)
    //     .map(y => y.replace(/\\/g, '/'))
    //     .map(x => '"' + x + '/*.js"');

    //static _entities = this;

    static _source = new DataSource({
        name        : Config.dialect,
        type        : Config.dialect,
        host        : Config.host,
        port        : Config.port,
        username    : Config.username,
        password    : Config.password,
        database    : Config.database,
        synchronize : true,
        //entities    : [this._basePath + '/**/**{.model.ts}'],
        entities    : [
            Client,
            AwardPointRedemption,
            Badge,
            BadgeCategory,
            DisbursedAwardPoint,
            ParticipantGroup,
            ParticipantBadge,
            Participant,
            Condition,
            Context,
            IncomingEvent,
            IncomingEventType,
            NodeDefaultAction,
            NodeInstance,
            Node,
            Rule,
            RuleAction,
            Schema,
            SchemaInstance,
            FileResource,
            Person,
            User,
            UserLoginSession,
            Role,
            Privilege,
            SchemaEventType,
            FileResourceVersion,
            BadgeStockImage,
        ],
        migrations  : [],
        subscribers : [],
        //logger      : 'advanced-console', //Use console for the typeorm logging
        logger      : new DBLogger(),
        logging     : true,
        poolSize    : Config.pool.max,
        cache       : true,
    });

    static getFoldersRecursively(location: string) {
        const items = fs.readdirSync(location, { withFileTypes: true });
        let paths = [];
        for (const item of items) {
            if (item.isDirectory()) {
                const fullPath = path.join(location, item.name);
                const childrenPaths = this.getFoldersRecursively(fullPath);
                paths = [
                    ...paths,
                    fullPath,
                    ...childrenPaths,
                ];
            }
        }
        return paths;
    }

    static initialize = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            this._source
                .initialize()
                .then(() => {
                    logger.info('Database connection has been established successfully.');
                    resolve(true);
                })
                .catch(error => {
                    logger.error('Unable to connect to the database:' + error.message);
                    reject(false);
                });
        });

    };

}

///////////////////////////////////////////////////////////////////////////////////

const Source = DatabaseConnector._source;

export { DatabaseConnector as DBConnector, Source };
