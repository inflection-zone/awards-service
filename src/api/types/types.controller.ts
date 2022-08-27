import express from 'express';
import { ResponseHandler } from '../../common/response.handler';
import { ErrorHandler } from '../../common/error.handler';
import { BaseController } from '../base.controller';
import { RoleService } from '../../database/repository.services/role.service';

///////////////////////////////////////////////////////////////////////////////////////

export class TypesController extends BaseController {

    //#region member variables and constructors

    _roleService: RoleService = null;

    constructor() {
        super();
        this._roleService = new RoleService();
    }

    //#endregion

    //#region Action methods

    getRoleTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorize('Types.GetRoleTypes', request, response, false);

            const types = await this._roleService.getAllRoles();
            if (types === null || types.length === 0) {
                ErrorHandler.throwInternalServerError(`Unable to retrieve user role types!`);
            }

            var roles = types.map(x => {
                return {
                    id          : x.id,
                    RoleName    : x.RoleName,
                    Description : x.Description
                };
            });
            
            ResponseHandler.success(request, response, 'User role types retrieved successfully!', 200, {
                RoleTypes : roles,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    //#endregion

}
