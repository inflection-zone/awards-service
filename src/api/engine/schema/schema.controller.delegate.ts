// import {
//     SchemeService
// } from '../../database/repository.services/schema.service';
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
//     SchemeValidator as validator
// } from './schema.validator';
// import {
//     uuid
// } from '../../../domain.types/miscellaneous/system.types';
// import {
//     SchemeCreateModel,
//     SchemeUpdateModel,
//     SchemeSearchFilters,
//     SchemeSearchResults
// } from '../../../domain.types/scheme.domain.types';

// ///////////////////////////////////////////////////////////////////////////////////////

// export class SchemaControllerDelegate {

//     //#region member variables and constructors

//     _service: SchemeService = null;

//     constructor() {
//         this._service = new SchemeService();
//     }

//     //#endregion

//     create = async (requestBody: any) => {
//         await validator.validateCreateRequest(requestBody);
//         var createModel: SchemeCreateModel = this.getCreateModel(requestBody);
//         const record = await this._service.create(createModel);
//         if (record === null) {
//             throw new ApiError('Unable to create scheme!', 400);
//         }
//         return this.getEnrichedDto(record);
//     }

//     getById = async (id: uuid) => {
//         const record = await this._service.getById(id);
//         if (record === null) {
//             ErrorHandler.throwNotFoundError('Scheme with id ' + id.toString() + ' cannot be found!');
//         }
//         return this.getEnrichedDto(record);
//     }

//     search = async (query: any) => {
//         await validator.validateSearchRequest(query);
//         var filters: SchemeSearchFilters = this.getSearchFilters(query);
//         var searchResults: SchemeSearchResults = await this._service.search(filters);
//         var items = searchResults.Items.map(x => this.getSearchDto(x));
//         searchResults.Items = items;
//         return searchResults;
//     }

//     update = async (id: uuid, requestBody: any) => {
//         await validator.validateUpdateRequest(requestBody);
//         const record = await this._service.getById(id);
//         if (record === null) {
//             ErrorHandler.throwNotFoundError('Scheme with id ' + id.toString() + ' cannot be found!');
//         }
//         const updateModel: SchemeUpdateModel = this.getUpdateModel(requestBody);
//         const updated = await this._service.update(id, updateModel);
//         if (updated == null) {
//             throw new ApiError('Unable to update scheme!', 400);
//         }
//         return this.getEnrichedDto(updated);
//     }

//     delete = async (id: uuid) => {
//         const record = await this._service.getById(id);
//         if (record == null) {
//             ErrorHandler.throwNotFoundError('Scheme with id ' + id.toString() + ' cannot be found!');
//         }
//         const schemeDeleted: boolean = await this._service.delete(id);
//         return {
//             Deleted: schemeDeleted
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
//         var name = query.name ? query.name : null;
//         if (name != null) {
//             filters['Name'] = name;
//         }
//         var validFrom = query.validFrom ? query.validFrom : null;
//         if (validFrom != null) {
//             filters['ValidFrom'] = validFrom;
//         }
//         var validTill = query.validTill ? query.validTill : null;
//         if (validTill != null) {
//             filters['ValidTill'] = validTill;
//         }

//         return filters;
//     }

//     getUpdateModel = (requestBody): SchemeUpdateModel => {

//         let updateModel: SchemeUpdateModel = {};

//         if (Helper.hasProperty(requestBody, 'ClientId')) {
//             updateModel.ClientId = requestBody.ClientId;
//         }
//         if (Helper.hasProperty(requestBody, 'Name')) {
//             updateModel.Name = requestBody.Name;
//         }
//         if (Helper.hasProperty(requestBody, 'Description')) {
//             updateModel.Description = requestBody.Description;
//         }

//         return updateModel;
//     }

//     getCreateModel = (requestBody): SchemeCreateModel => {
//         return {
//             ClientId: requestBody.ClientId ? requestBody.ClientId : null,
//             Name: requestBody.Name ? requestBody.Name : null,
//             Description: requestBody.Description ? requestBody.Description : null
//         };
//     }

//     getEnrichedDto = (record) => {
//         if (record == null) {
//             return null;
//         }
//         return {
//             id: record.id,
//             ClientId: record.ClientId,
//             Name: record.Name,
//             Description: record.Description,
//             ValidFrom: record.ValidFrom,
//             ValidTill: record.ValidTill
//         };
//     }

//     getSearchDto = (record) => {
//         if (record == null) {
//             return null;
//         }
//         return {
//             id: record.id,
//             ClientId: record.ClientId,
//             Name: record.Name,
//             Description: record.Description,
//             ValidFrom: record.ValidFrom,
//             ValidTill: record.ValidTill
//         };
//     }

//     //#endregion
// }
// ///////////////////////////////////////////////////////////////////////////////////////////////