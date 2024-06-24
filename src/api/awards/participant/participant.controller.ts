import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { ParticipantValidator } from './participant.validator';
import { BaseController } from '../../base.controller';
import { ParticipantService } from '../../../database/services/awards/participant.service';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { ParticipantBadgeResponseDto, ParticipantCreateModel, ParticipantSearchFilters, ParticipantUpdateModel } from '../../../domain.types/awards/participant.domain.types';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { BadgeService } from '../../../database/services/awards/badge.service';
import { BadgeResponseDto } from '../../../domain.types/awards/badge.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ParticipantController extends BaseController {

    //#region member variables and constructors

    _service: ParticipantService = null;

    _badgeService: BadgeService = null;

    _validator: ParticipantValidator = null;

    constructor() {
        super();
        this._service = new ParticipantService();
        this._badgeService = new BadgeService();
        this._validator = new ParticipantValidator();
    }

    //#endregion

    create = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Participant.Create', request, response, false);
            var model: ParticipantCreateModel = await this._validator.validateCreateRequest(request);
            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to add participant!');
            }
            const message = 'Participant added successfully!';
            return ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Participant.GetById', request, response, false);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            const message = 'Participant retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByReferenceId = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Participant.GetByReferenceId', request, response, false);
            var referenceId: uuid = await this._validator.validateParamAsUUID(request, 'referenceId');
            const record = await this._service.getByReferenceId(referenceId);
            const message = 'Participant retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByClientId = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Participant.GetByClientId', request, response, false);
            var clientId: uuid = await this._validator.validateParamAsUUID(request, 'clientId');
            const records = await this._service.getByClientId(clientId);
            const message = 'Participant retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, records);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Participant.Update', request, response, false);
            const id = await this._validator.validateParamAsUUID(request, 'id');
            var model: ParticipantUpdateModel = await this._validator.validateUpdateRequest(request);
            const updatedRecord = await this._service.update(id, model);
            const message = 'Participant updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Participant.Search', request, response, false);
            var filters: ParticipantSearchFilters = await this._validator.validateSearchRequest(request);
            const searchResults = await this._service.search(filters);
            const message = 'Participant records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Participant.Delete', request, response, false);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const result = await this._service.delete(id);
            const message = 'Participant deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getBadges = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Participant.GetBadges', request, response, false);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const participantBadges = await this._service.getBadges(id);
            const message = 'Participant badges retrieved successfully!';

            const participant = await this._service.getById(id);
            if (participant === null) {
                ErrorHandler.throwNotFoundError(`Participant with Id: ${id} does not exist!`);
            }
            const clientId = participant.Client?.id;
            const allBadges = await this._badgeService.getByClientId(clientId);
            const badges = this.classifyAllBadgesByCategory(allBadges);
            const classified = this.classifyParticipantBadges(participantBadges, badges);
            var result = await this._service.getBadgeImageUrl(participantBadges, classified);

            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    private classifyAllBadgesByCategory = (allBadges: BadgeResponseDto[]) => {
        const badges = allBadges.reduce((acc, x) => {
            if (!acc[x.Category?.Name]) {
                acc[x.Category?.Name] = {
                    CategoryName: x.Category?.Name,
                    Badges: {},
                };
            }
            acc[x.Category?.Name].Badges[x.Name] = {
                BadgeName: x.Name,
                Occurrences: 0,
                BadgeList: [],
            };
            return acc;
        }, {});
        return badges;
    };

    private classifyParticipantBadges = (participantBadges: ParticipantBadgeResponseDto[], badges: any) => {

        const badgesByCategoryName = participantBadges.reduce((acc, x) => {
            if (!acc[x.Badge?.Category?.Name]) {
                acc[x.Badge?.Category?.Name] = [];
            }
            acc[x.Badge?.Category?.Name].push(x);
            return acc;
        }, {});

        for (const key in badgesByCategoryName) {

            const arr = badgesByCategoryName[key];
            const classfiedByBadgeName = arr.reduce((acc, x) => {
                if (!acc[x.Badge?.Name]) {
                    acc[x.Badge?.Name] = [];
                }
                acc[x.Badge?.Name].push(x);
                return acc;
            }, {});

            badges[key] = {
                CategoryName: key,
                Badges: {},
            };

            for (const badgeName in classfiedByBadgeName) {
                let bArr = classfiedByBadgeName[badgeName] as any[];
                bArr = bArr.sort((a, b) => {
                    return a.Badge.Name.localeCompare(b.Badge.Name);
                });
                const occurrences = bArr.length;
                badges[key].Badges[badgeName] = {
                    BadgeName: badgeName,
                    Occurrences: occurrences,
                    BadgeList: bArr,
                };
            }
        }
        return badges;
    };

}
