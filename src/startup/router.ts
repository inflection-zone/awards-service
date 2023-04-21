import express from "express";
import { logger } from "../logger/logger";
import { register as registerUserRoutes } from "../api/user/user.routes";
import { register as registerClientRoutes } from "../api/client/client.routes";
import { register as registerBadgeRoutes } from "../api/awards/badge/badge.routes";
import { register as registerBadgeCategoryRoutes } from "../api/awards/badge.category/badge.category.routes";
import { register as registerParticipantRoutes } from "../api/awards/participant/participant.routes";
import { register as registerParticipantGroupRoutes } from "../api/awards/participant.group/participant.group.routes";
import { register as registerSchemaRoutes } from '../api/engine/schema/schema.routes';
import { register as registerNodeRoutes } from '../api/engine/node/node.routes';
import { register as registerRuleRoutes } from '../api/engine/rule/rule.routes';
import { register as registerConditionRoutes } from '../api/engine/condition/condition.routes';
import { register as registerIncomingEventRoutes } from '../api/engine/incoming.event/incoming.event.routes';
import { register as registerIncomingEventTypeRoutes } from '../api/engine/incoming.event.type/incoming.event.type.routes';
import { register as registerSchemaInstanceRoutes } from '../api/engine/schema.instance/schema.instance.routes';
import { register as registerTypesRoutes } from '../api/types/types.routes';

////////////////////////////////////////////////////////////////////////////////////

export class Router {

    private _app = null;

    constructor(app: express.Application) {
        this._app = app;
    }

    public init = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {

                //Handling the base route
                this._app.get('/api/v1/', (req, res) => {
                    res.send({
                        message : `Careplan Service API [Version ${process.env.API_VERSION}]`,
                    });
                });

                registerUserRoutes(this._app);
                registerClientRoutes(this._app);
                registerBadgeRoutes(this._app);
                registerBadgeCategoryRoutes(this._app);
                registerParticipantRoutes(this._app);
                registerParticipantGroupRoutes(this._app);
                registerSchemaRoutes(this._app);
                registerNodeRoutes(this._app);
                registerRuleRoutes(this._app);
                registerConditionRoutes(this._app);
                registerIncomingEventTypeRoutes(this._app);
                registerIncomingEventRoutes(this._app);
                registerSchemaInstanceRoutes(this._app);
                registerTypesRoutes(this._app);

                resolve(true);

            } catch (error) {
                logger.error('Error initializing the router: ' + error.message);
                reject(false);
            }
        });
    };

}
