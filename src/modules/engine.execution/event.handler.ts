import { logger } from "../../logger/logger";
import { IncomingEventResponseDto } from "../../domain.types/engine/incoming.event.types";
import * as asyncLib from 'async';
import { ContextService } from "../../database/services/engine/context.service";
import { ContextType } from "../../domain.types/engine/engine.enums";
import { SchemaInstanceService } from "../../database/services/engine/schema.instance.service";

//////////////////////////////////////////////////////////////////////////////

const ASYNC_TASK_COUNT = 4;

export default class EventHandler {

    private static _q = asyncLib.queue((event: IncomingEventResponseDto, onCompleted) => {
        (async () => {
            await EventHandler.processEvent(event);
            onCompleted(event);
        })();
    }, ASYNC_TASK_COUNT);

    private static enqueue = (model: IncomingEventResponseDto) => {
        EventHandler._q.push(model, (model, error) => {
            if (error) {
                logger.error(`Error handling incoming event: ${JSON.stringify(error)}`);
                logger.error(`Error handling incoming event: ${JSON.stringify(error.stack, null, 2)}`);
            }
            else {
                logger.info(`Recorded EHR record: ${JSON.stringify(model, null, 2)}`);
            }
        });
    };

    static handle = async (event: IncomingEventResponseDto) => {
        return new Promise((resolve, reject) => {
            try {
                EventHandler.enqueue(event);
                resolve(true);
            }
            catch (error) {
                reject(error);
            }
        });
    };

    private static processEvent = async (event: IncomingEventResponseDto) => {

        logger.info(JSON.stringify(event, null, 2));
        //Process incoming event here...

        const contextService = new ContextService();
        const schemaInstanceService = new SchemaInstanceService();
        const referenceId = event.ReferenceId;
        var context = await contextService.getByReferenceId(referenceId);
        if (!context) {
            context = await contextService.create({
                ReferenceId : referenceId,
                Type        : ContextType.Person
            });
        }
        const schemaInstances = await schemaInstanceService.getByContextId(context.id);
        const filtered = schemaInstances.filter(x => 
            x.Schema.EventTypes.find(y => y.id === event.EventType.id) !== undefined);
        //const filtered = await schemaInstanceService.getByContextAndEventType(context.id, event.EventType.id);

        for await (var schemaInstance of filtered) {
            //const instance = 
        }
    };

}
