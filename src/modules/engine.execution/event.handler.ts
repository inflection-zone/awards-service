import { logger } from "../../logger/logger";
import { IncomingEventResponseDto } from "../../domain.types/engine/incoming.event.types";
import * as asyncLib from 'async';

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

    private static processEvent = (event: IncomingEventResponseDto) => {
        logger.info(JSON.stringify(event, null, 2));
        //Process incoming event here...
    };

}
