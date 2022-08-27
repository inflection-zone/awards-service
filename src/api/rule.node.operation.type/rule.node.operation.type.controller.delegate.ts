import {
    RuleNodeOperationTypeService
} from '../../database/repository.services/rule.node.operation.type.service';
import {
    ErrorHandler
} from '../../common/error.handler';
import {
    Helper
} from '../../common/helper';
import {
    ApiError
} from '../../common/api.error';
import {
    RuleNodeOperationTypeValidator as validator
} from './rule.node.operation.type.validator';
import {
    uuid
} from '../../domain.types/miscellaneous/system.types';
import {
    RuleNodeOperationTypeCreateModel,
    RuleNodeOperationTypeUpdateModel,
    RuleNodeOperationTypeSearchFilters,
    RuleNodeOperationTypeSearchResults
} from '../../domain.types/rule.node.operation.type.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class RuleNodeOperationTypeControllerDelegate {

    //#region member variables and constructors

    _service: RuleNodeOperationTypeService = null;

    constructor() {
        this._service = new RuleNodeOperationTypeService();
    }

    //#endregion

    create = async (requestBody: any) => {
        await validator.validateCreateRequest(requestBody);
        var createModel: RuleNodeOperationTypeCreateModel = this.getCreateModel(requestBody);
        const record = await this._service.create(createModel);
        if (record === null) {
            throw new ApiError('Unable to create rule node operation type!', 400);
        }
        return this.getEnrichedDto(record);
    }

    getById = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Rule node operation type with id ' + id.toString() + ' cannot be found!');
        }
        return this.getEnrichedDto(record);
    }

    search = async (query: any) => {
        await validator.validateSearchRequest(query);
        var filters: RuleNodeOperationTypeSearchFilters = this.getSearchFilters(query);
        var searchResults: RuleNodeOperationTypeSearchResults = await this._service.search(filters);
        var items = searchResults.Items.map(x => this.getSearchDto(x));
        searchResults.Items = items;
        return searchResults;
    }

    update = async (id: uuid, requestBody: any) => {
        await validator.validateUpdateRequest(requestBody);
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Rule node operation type with id ' + id.toString() + ' cannot be found!');
        }
        const updateModel: RuleNodeOperationTypeUpdateModel = this.getUpdateModel(requestBody);
        const updated = await this._service.update(id, updateModel);
        if (updated == null) {
            throw new ApiError('Unable to update rule node operation type!', 400);
        }
        return this.getEnrichedDto(updated);
    }

    delete = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record == null) {
            ErrorHandler.throwNotFoundError('Rule node operation type with id ' + id.toString() + ' cannot be found!');
        }
        const ruleNodeOperationTypeDeleted: boolean = await this._service.delete(id);
        return {
            Deleted: ruleNodeOperationTypeDeleted
        };
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////

    //#region Privates

    getSearchFilters = (query) => {

        var filters = {};

        var composition = query.composition ? query.composition : null;
        if (composition != null) {
            filters['Composition'] = composition;
        }
        var logical = query.logical ? query.logical : null;
        if (logical != null) {
            filters['Logical'] = logical;
        }
        var mathematical = query.mathematical ? query.mathematical : null;
        if (mathematical != null) {
            filters['Mathematical'] = mathematical;
        }

        return filters;
    }

    getUpdateModel = (requestBody): RuleNodeOperationTypeUpdateModel => {

        let updateModel: RuleNodeOperationTypeUpdateModel = {};

        if (Helper.hasProperty(requestBody, 'Composition')) {
            updateModel.Composition = requestBody.Composition;
        }
        if (Helper.hasProperty(requestBody, 'Logical')) {
            updateModel.Logical = requestBody.Logical;
        }
        if (Helper.hasProperty(requestBody, 'Mathematical')) {
            updateModel.Mathematical = requestBody.Mathematical;
        }

        return updateModel;
    }

    getCreateModel = (requestBody): RuleNodeOperationTypeCreateModel => {
        return {
            Composition: requestBody.Composition ? requestBody.Composition : null,
            Logical: requestBody.Logical ? requestBody.Logical : null,
            Mathematical: requestBody.Mathematical ? requestBody.Mathematical : null
        };
    }

    getEnrichedDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            Composition: record.Composition,
            Logical: record.Logical,
            Mathematical: record.Mathematical
        };
    }

    getSearchDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            Composition: record.Composition,
            Logical: record.Logical,
            Mathematical: record.Mathematical
        };
    }

    //#endregion
}
///////////////////////////////////////////////////////////////////////////////////////////////