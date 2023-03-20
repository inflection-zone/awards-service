import joi from 'joi';
import express from 'express';
import { 
    ParticipantCreateModel, 
    ParticipantUpdateModel, 
    ParticipantSearchFilters 
} from '../../../domain.types/awards/participant.domain.types';
import {
    ErrorHandler
} from '../../../common/handlers/error.handler';
import { Gender } from '../../../domain.types/miscellaneous/system.types';
import BaseValidator from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////////////

export class ParticipantValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request): Promise<ParticipantCreateModel> => {

    try {
            const schema = joi.object({
                ReferenceId     : joi.string(),
                ClientId        : joi.string().uuid(),
                Prefix          : joi.string().max(32).optional(),
                FirstName       : joi.string().max(64).optional(),
                LastName        : joi.string().max(64).optional(),
                CountryCode     : joi.string().max(16).optional(),
                Phone           : joi.string().max(16).min(6).optional(),
                Email           : joi.string().max(256).optional(),
                Gender          : joi.string().valid(...Object.values(Gender)).optional(),
                BirthDate       : joi.date().optional(),
                ProfileImageUrl : joi.string().max(1024).optional(),
                OnboardingDate  : joi.date().optional(),
            });
            await schema.validateAsync(request.body);
            return {
                ReferenceId     : request.body.ReferenceId,
                ClientId        : request.body.ClientId,
                Prefix          : request.body.Prefix ?? null,
                FirstName       : request.body.FirstName ?? null,
                LastName        : request.body.LastName ?? null,
                CountryCode     : request.body.CountryCode ?? null,
                Phone           : request.body.Phone ?? null,
                Email           : request.body.Email ?? null,
                Gender          : request.body.Gender ?? null,
                BirthDate       : request.body.BirthDate ?? null,
                ProfileImageUrl : request.body.ProfileImageUrl ?? null,
                OnboardingDate  : request.body.OnboardingDate ?? null,
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (request: express.Request): Promise<ParticipantUpdateModel> => {
        try {
            const schema = joi.object({
                Prefix          : joi.string().max(32).optional(),
                FirstName       : joi.string().max(64).optional(),
                LastName        : joi.string().max(64).optional(),
                CountryCode     : joi.string().max(16).optional(),
                Phone           : joi.string().max(16).min(6).optional(),
                Email           : joi.string().max(256).email().optional(),
                Gender          : joi.string().valid(...Object.values(Gender)).optional(),
                BirthDate       : joi.date().optional(),
                ProfileImageUrl : joi.string().max(1024).optional(),
                OnboardingDate  : joi.date().optional(),
            });
            await schema.validateAsync(request.body);
            const id = await this.validateParamAsUUID(request, 'id');
            return {
                id,
                ReferenceId     : request.body.ReferenceId ?? null,
                ClientId        : request.body.ClientId ?? null,
                Prefix          : request.body.Prefix ?? null,
                FirstName       : request.body.FirstName ?? null,
                LastName        : request.body.LastName ?? null,
                CountryCode     : request.body.CountryCode ?? null,
                Phone           : request.body.Phone ?? null,
                Email           : request.body.Email ?? null,
                Gender          : request.body.Gender ?? null,
                BirthDate       : request.body.BirthDate ?? null,
                ProfileImageUrl : request.body.ProfileImageUrl ?? null,
                OnboardingDate  : request.body.OnboardingDate ?? null,
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request): Promise<ParticipantSearchFilters> => {
        try {
            const schema = joi.object({
                clientId : joi.string().uuid().optional(),
                name     : joi.string().max(64).optional(),
                phone    : joi.string().max(12).min(2).optional(),
                email    : joi.string().min(3).optional(),
            });
            await schema.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): ParticipantSearchFilters => {

        var filters = {};

        var name = query.name ? query.name : null;
        if (name != null) {
            filters['Name'] = name;
        }
        var clientId = query.clientId ? query.clientId : null;
        if (clientId != null) {
            filters['ClientId'] = clientId;
        }
        var phone = query.phone ? query.phone : null;
        if (phone != null) {
            filters['Phone'] = phone;
        }
        var email = query.email ? query.email : null;
        if (email != null) {
            filters['Email'] = email;
        }

        return filters;
    };

}
