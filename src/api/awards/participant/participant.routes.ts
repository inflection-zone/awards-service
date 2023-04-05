import express from 'express';
import {
    ParticipantController
} from './participant.controller';
import {
    Loader
} from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.Authenticator;
    const controller = new ParticipantController();

    router.post('/', authenticator.authenticateClient, controller.create);
    router.get('/search', authenticator.authenticateClient, controller.search);

    router.get('/:id/badges', authenticator.authenticateClient, controller.getBadges);
    router.get('/by-reference-id/:referenceId', authenticator.authenticateClient, controller.getByReferenceId);
    router.get('/by-client-id/:clientId', authenticator.authenticateClient, controller.getByClientId);

    router.get('/:id', authenticator.authenticateClient, controller.getById);
    router.put('/:id', authenticator.authenticateClient, controller.update);
    router.delete('/:id', authenticator.authenticateClient, controller.delete);

    app.use('/api/v1/participants', router);
};
