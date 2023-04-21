// import {
//     RedemptionService
// } from '../../database/services/redemption.service';
// import {
//     ErrorHandler
// } from '../../../common/error.handler';
// import {
//     Helper
// } from '../../../common/helper';
// import {
//     ApiError
// } from '../../../common/api.error';
// import {
//     RedemptionValidator as validator
// } from './redemption.validator';
// import {
//     uuid
// } from '../../../domain.types/miscellaneous/system.types';
// import {
//     RedemptionCreateModel,
//     RedemptionUpdateModel,
//     RedemptionSearchFilters,
//     RedemptionSearchResults
// } from '../../../domain.types/redemption.domain.types';

// ///////////////////////////////////////////////////////////////////////////////////////

// export class RedemptionControllerDelegate {

//     //#region member variables and constructors

//     _service: RedemptionService = null;

//     constructor() {
//         this._service = new RedemptionService();
//     }

//     //#endregion

//     create = async (requestBody: any) => {
//         await validator.validateCreateRequest(requestBody);
//         var createModel: RedemptionCreateModel = this.getCreateModel(requestBody);
//         const record = await this._service.create(createModel);
//         if (record === null) {
//             ErrorHandler.throwInternalServerError('Unable to create redemption!', 400);
//         }
//         return this.getEnrichedDto(record);
//     }

//     getById = async (id: uuid) => {
//         const record = await this._service.getById(id);
//         if (record === null) {
//             ErrorHandler.throwNotFoundError('Redemption with id ' + id.toString() + ' cannot be found!');
//         }
//         return this.getEnrichedDto(record);
//     }

//     search = async (query: any) => {
//         await validator.validateSearchRequest(query);
//         var filters: RedemptionSearchFilters = this.getSearchFilters(query);
//         var searchResults: RedemptionSearchResults = await this._service.search(filters);
//         var items = searchResults.Items.map(x => this.getSearchDto(x));
//         searchResults.Items = items;
//         return searchResults;
//     }

//     update = async (id: uuid, requestBody: any) => {
//         await validator.validateUpdateRequest(requestBody);
//         const record = await this._service.getById(id);
//         if (record === null) {
//             ErrorHandler.throwNotFoundError('Redemption with id ' + id.toString() + ' cannot be found!');
//         }
//         const updateModel: RedemptionUpdateModel = this.getUpdateModel(requestBody);
//         const updated = await this._service.update(id, updateModel);
//         if (updated == null) {
//             ErrorHandler.throwInternalServerError('Unable to update redemption!', 400);
//         }
//         return this.getEnrichedDto(updated);
//     }

//     delete = async (id: uuid) => {
//         const record = await this._service.getById(id);
//         if (record == null) {
//             ErrorHandler.throwNotFoundError('Redemption with id ' + id.toString() + ' cannot be found!');
//         }
//         const redemptionDeleted: boolean = await this._service.delete(id);
//         return {
//             Deleted: redemptionDeleted
//         };
//     }

//     ///////////////////////////////////////////////////////////////////////////////////////////////

//     //#region Privates

//     getSearchFilters = (query) => {

//         var filters = {};

//         var clientId = query.clientId ? query.clientId : null;
//         if (clientId != null) {
//             filters['ClientId'] = clientId;
//         }
//         var schemeId = query.schemeId ? query.schemeId : null;
//         if (schemeId != null) {
//             filters['SchemeId'] = schemeId;
//         }
//         var participantId = query.participantId ? query.participantId : null;
//         if (participantId != null) {
//             filters['ParticipantId'] = participantId;
//         }
//         var name = query.name ? query.name : null;
//         if (name != null) {
//             filters['Name'] = name;
//         }
//         var redemptionDate = query.redemptionDate ? query.redemptionDate : null;
//         if (redemptionDate != null) {
//             filters['RedemptionDate'] = redemptionDate;
//         }
//         var redemptionStatus = query.redemptionStatus ? query.redemptionStatus : null;
//         if (redemptionStatus != null) {
//             filters['RedemptionStatus'] = redemptionStatus;
//         }
//         var rootRuleNodeId = query.rootRuleNodeId ? query.rootRuleNodeId : null;
//         if (rootRuleNodeId != null) {
//             filters['RootRuleNodeId'] = rootRuleNodeId;
//         }

//         return filters;
//     }

//     getUpdateModel = (requestBody): RedemptionUpdateModel => {

//         let updateModel: RedemptionUpdateModel = {};

//         if (Helper.hasProperty(requestBody, 'ClientId')) {
//             updateModel.ClientId = requestBody.ClientId;
//         }
//         if (Helper.hasProperty(requestBody, 'SchemeId')) {
//             updateModel.SchemeId = requestBody.SchemeId;
//         }
//         if (Helper.hasProperty(requestBody, 'ParticipantId')) {
//             updateModel.ParticipantId = requestBody.ParticipantId;
//         }
//         if (Helper.hasProperty(requestBody, 'Name')) {
//             updateModel.Name = requestBody.Name;
//         }
//         if (Helper.hasProperty(requestBody, 'Description')) {
//             updateModel.Description = requestBody.Description;
//         }
//         if (Helper.hasProperty(requestBody, 'RootRuleNodeId')) {
//             updateModel.RootRuleNodeId = requestBody.RootRuleNodeId;
//         }

//         return updateModel;
//     }

//     getCreateModel = (requestBody): RedemptionCreateModel => {
//         return {
//             ClientId: requestBody.ClientId ? requestBody.ClientId : null,
//             SchemeId: requestBody.SchemeId ? requestBody.SchemeId : null,
//             ParticipantId: requestBody.ParticipantId ? requestBody.ParticipantId : null,
//             Name: requestBody.Name ? requestBody.Name : null,
//             Description: requestBody.Description ? requestBody.Description : null,
//             RootRuleNodeId: requestBody.RootRuleNodeId ? requestBody.RootRuleNodeId : null
//         };
//     }

//     getEnrichedDto = (record) => {
//         if (record == null) {
//             return null;
//         }
//         return {
//             id: record.id,
//             ClientId: record.ClientId,
//             SchemeId: record.SchemeId,
//             ParticipantId: record.ParticipantId,
//             Name: record.Name,
//             Description: record.Description,
//             RedemptionDate: record.RedemptionDate,
//             RedemptionStatus: record.RedemptionStatus,
//             RootRuleNodeId: record.RootRuleNodeId
//         };
//     }

//     getSearchDto = (record) => {
//         if (record == null) {
//             return null;
//         }
//         return {
//             id: record.id,
//             ClientId: record.ClientId,
//             SchemeId: record.SchemeId,
//             ParticipantId: record.ParticipantId,
//             Name: record.Name,
//             Description: record.Description,
//             RedemptionDate: record.RedemptionDate,
//             RedemptionStatus: record.RedemptionStatus,
//             RootRuleNodeId: record.RootRuleNodeId
//         };
//     }

//     //#endregion
// }
// ///////////////////////////////////////////////////////////////////////////////////////////////
