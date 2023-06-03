import express from 'express';
import {
    ParticipantGroupController
} from './participant.group.controller';
import {
    Loader
} from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.Authenticator;
    const controller = new ParticipantGroupController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    router.post('/:id/participants/', authenticator.authenticateClient, authenticator.authenticateUser, controller.addParticipant);
    router.delete('/:id/participants/:participantId', authenticator.authenticateClient, authenticator.authenticateUser, controller.removeParticipant);
    router.get('/:id/participants/', authenticator.authenticateClient, authenticator.authenticateUser, controller.getParticipants);

    app.use('/api/v1/participant-groups', router);
};
