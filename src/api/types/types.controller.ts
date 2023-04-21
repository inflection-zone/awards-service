import express from 'express';
import { ResponseHandler } from '../../common/handlers/response.handler';
import { ErrorHandler } from '../../common/handlers/error.handler';
import { BaseController } from '../base.controller';
import { RoleService } from '../../database/services/user/role.service';
import { 
    CompositionOperatorList, 
    ConditionOperandDataTypeList, 
    ContextTypeList, 
    DataActionTypeList, 
    EventActionTypeList, 
    ExecutionStatusList, 
    InputSourceTypeList, 
    LogicalOperatorList, 
    MathematicalOperatorList, 
    OperatorList, 
    OutputSourceTypeList } from '../../domain.types/engine/engine.types';
import { IncomingEventTypeService } from '../../database/services/engine/incoming.event.type.service';

///////////////////////////////////////////////////////////////////////////////////////

export class TypesController extends BaseController {

    //#region member variables and constructors

    _roleService: RoleService = null;

    _eventTypeService: IncomingEventTypeService = null;

    constructor() {
        super();
        this._roleService = new RoleService();
        this._eventTypeService = new IncomingEventTypeService();
    }

    //#endregion

    //#region Action methods

    getRoleTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorize('Types.GetRoleTypes', request, response, false);
            const types = await this._roleService.getAll();
            if (types === null || types.length === 0) {
                ErrorHandler.throwInternalServerError(`Unable to retrieve user role types!`);
            }
            ResponseHandler.success(request, response, 'User role types retrieved successfully!', 200, {
                Types : types,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getEventTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorize('Types.GetEventTypes', request, response, false);
            const types = await this._eventTypeService.getAll();
            ResponseHandler.success(request, response, 'User role types retrieved successfully!', 200, {
                Types : types,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getEventActionTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorize('Types.GetEventActionTypes', request, response, false);
            ResponseHandler.success(request, response, 'Event action types retrieved successfully!', 200, {
                Types : EventActionTypeList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getContextTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorize('Types.GetContextTypes', request, response, false);
            ResponseHandler.success(request, response, 'Context types retrieved successfully!', 200, {
                Types : ContextTypeList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getConditionOperatorTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorize('Types.GetConditionOperatorTypes', request, response, false);
            ResponseHandler.success(request, response, 'Condition operator types retrieved successfully!', 200, {
                Types : OperatorList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getLogicalOperatorTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorize('Types.GetLogicalOperatorTypes', request, response, false);
            ResponseHandler.success(request, response, 'Logical operator types retrieved successfully!', 200, {
                Types : LogicalOperatorList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getCompositeOperatorTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorize('Types.GetCompositeOperatorTypes', request, response, false);
            ResponseHandler.success(request, response, 'Composite operator types retrieved successfully!', 200, {
                Types : CompositionOperatorList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getMathematicalOperatorTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorize('Types.GetMathematicalOperatorTypes', request, response, false);
            ResponseHandler.success(request, response, 'Mathematical operator types retrieved successfully!', 200, {
                Types : MathematicalOperatorList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getOperandDataTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorize('Types.GetOperandDataTypes', request, response, false);
            ResponseHandler.success(request, response, 'Operand data types retrieved successfully!', 200, {
                Types : ConditionOperandDataTypeList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getExecutionStatusTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorize('Types.GetExecutionStatusTypes', request, response, false);
            ResponseHandler.success(request, response, 'Execution status types retrieved successfully!', 200, {
                Types : ExecutionStatusList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    
    getDataActionTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorize('Types.GetDataActionTypes', request, response, false);
            ResponseHandler.success(request, response, 'Data action types retrieved successfully!', 200, {
                Types : DataActionTypeList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    
    getInputSourceTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorize('Types.GetInputSourceTypes', request, response, false);
            ResponseHandler.success(request, response, 'Input source types retrieved successfully!', 200, {
                Types : InputSourceTypeList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    
    getOutputSourceTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorize('Types.GetOutputSourceTypes', request, response, false);
            ResponseHandler.success(request, response, 'Output source types retrieved successfully!', 200, {
                Types : OutputSourceTypeList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
