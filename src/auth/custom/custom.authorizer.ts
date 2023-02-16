import express from 'express';
import jwt from 'jsonwebtoken';

import { Logger } from '../../logger/logger';
import { IAuthorizer } from '../authorizer.interface';
import { CurrentUser } from '../../domain.types/miscellaneous/current.user';
import { RolePrivilegeService } from '../../database/repository.services/role.privilege.service';
import { Loader } from '../../startup/loader';
import { ConfigurationManager } from '../../config/configuration.manager';

//const execSync = require('child_process').execSync;

//////////////////////////////////////////////////////////////

export class CustomAuthorizer implements IAuthorizer {

    _rolePrivilegeService: RolePrivilegeService = null;

    constructor() {
        this._rolePrivilegeService = Loader.Container.resolve(RolePrivilegeService);
    }

    public authorize = async (request: express.Request): Promise<boolean> => {
        try {
            const currentUser = request.currentUser;
            const context = request.context;
            if (context == null || context === 'undefined') {
                return false;
            }
            if (currentUser == null) {
                return false;
            }
            const hasPrivilege = await this._rolePrivilegeService.hasPrivilegeForRole(
                currentUser.CurrentRoleId,
                context);

            if (!hasPrivilege) {
                return false;
            }
            const isResourceOwner = await this.isResourceOwner(currentUser, request);
            const hasConsent = await this.hasConsent(currentUser.CurrentRoleId, context);
            if (hasConsent || isResourceOwner) {
                return true;
            }
            return false;
        } catch (error) {
            logger.log(error.message);
        }
        return false;
    };

    public generateUserSessionToken = async (user: CurrentUser): Promise<string> => {
        return new Promise((resolve, reject) => {
            try {
                const expiresIn: number = ConfigurationManager.JwtExpiresIn();
                var seconds = expiresIn.toString() + 's';
                const token = jwt.sign(user, process.env.USER_ACCESS_TOKEN_SECRET, { expiresIn: seconds });
                resolve(token);
            } catch (error) {
                reject(error);
            }
        });
    };

    private isResourceOwner = async (user: CurrentUser, request: express.Request): Promise<boolean> => {
        if (request.resourceOwnerUserId === user.UserId) {
            return true;
        }
        return false;
    };

    private hasConsent = async (currentRoleId: number, context: string): Promise<boolean> => {

        logger.log('Current role id: ' + currentRoleId);
        logger.log('Context: ' + context);

        //for time being, return true always
        return true;
    };

}
