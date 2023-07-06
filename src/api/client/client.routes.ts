import express from 'express';
import {
    ClientController
} from './client.controller';
import {
    Loader
} from '../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.Authenticator;
    const controller = new ClientController();

    router.post('/', authenticator.authenticateUser, controller.create);

    router.get('/:clientCode/current-api-key', controller.getCurrentApiKey);
    router.put('/:clientCode/renew-api-key', controller.renewApiKey);

    router.get('/search', authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateUser, controller.getById);
    router.get('/', authenticator.authenticateClient, controller.getByApiKey);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);


    app.use('/api/v1/clients', router);
};
