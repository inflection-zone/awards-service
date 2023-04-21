import { logger } from "../../logger/logger";
import { IncomingEventResponseDto } from "../../domain.types/engine/incoming.event.types";
import * as asyncLib from 'async';
import { ContextService } from "../../database/services/engine/context.service";
import { ContextType } from "../../domain.types/engine/engine.types";
import { SchemaInstanceService } from "../../database/services/engine/schema.instance.service";
import { SchemaEngine } from "./schema.engine";
import { SchemaService } from "../../database/services/engine/schema.service";
import { SchemaInstanceResponseDto, SchemaInstanceSearchFilters } from "../../domain.types/engine/schema.instance.types";

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

        try {
            logger.info(JSON.stringify(event, null, 2));
            //Process incoming event here...

            const contextService = new ContextService();
            const schemaInstanceService = new SchemaInstanceService();
            const schemaService = new SchemaService();
            const referenceId = event.ReferenceId;
            var context = await contextService.getByReferenceId(referenceId);
            if (!context) {
                context = await contextService.create({
                    ReferenceId : referenceId,
                    Type        : ContextType.Person
                });
            }

            const eventType = event.EventType;
            const schemaForEventType = await schemaService.getByEventType(eventType.id);
            const filtered: SchemaInstanceResponseDto[] = [];
            for await (var s of schemaForEventType) {
                const schemaId = s.id;
                const filters: SchemaInstanceSearchFilters = {
                    ContextId : context.id,
                    SchemaId  : schemaId
                };
                const searchResults = await schemaInstanceService.search(filters);
                const schemaInstances = searchResults.Items;
                if (schemaInstances.length === 0) {
                    const schemaInstance = await schemaInstanceService.create({
                        SchemaId  : schemaId,
                        ContextId : context.id
                    });
                    if (schemaInstance) {
                        logger.info(`Schema instance created successfully!`);
                    }
                    filtered.push(schemaInstance);
                }
                else {
                    filtered.push(...schemaInstances);
                }
            }

            for await (var instance of filtered) {
                await SchemaEngine.execute(instance);
            }
        }
        catch (error) {
            logger.error(`Error: ${error.message}`);
            logger.error(`Error: ${error.stack}`);
        }

    };

}
