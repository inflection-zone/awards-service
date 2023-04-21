import express from 'express';
import {
    Loader
} from '../../../startup/loader';
import { IncomingEventController } from './incoming.event.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.Authenticator;
    const controller = new IncomingEventController();

    router.post('/', authenticator.authenticateClient, controller.create);
    router.get('/search', authenticator.authenticateClient, controller.search);
    router.get('/:id', authenticator.authenticateClient, controller.getById);

    app.use('/api/v1/engine/events', router);
};
