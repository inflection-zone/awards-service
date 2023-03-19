import z from 'zod';
import express from 'express';
import { ParticipantCreateModel, ParticipantUpdateModel, ParticipantSearchFilters } from '../../../domain.types/awards/participant.domain.types';
import {
    ErrorHandler
} from '../../../common/error.handler';
import { Gender } from '../../../domain.types/miscellaneous/system.types';
import BaseValidator from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////////////

export class ParticipantValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request): Promise<ParticipantCreateModel> => {
        try {
            const schema = z.object({
                ReferenceId     : z.string(),
                ClientId        : z.string().uuid().optional(),
                Prefix          : z.string().max(32).optional(),
                FirstName       : z.string().max(64).optional(),
                LastName        : z.string().max(64).optional(),
                CountryCode     : z.string().max(16).optional(),
                Phone           : z.string().max(16).min(6).optional(),
                Email           : z.string().max(256).optional(),
                Gender          : z.nativeEnum(Gender).optional(),
                BirthDate       : z.date().optional(),
                ProfileImageUrl : z.string().max(1024).optional(),
                OnboardingDate  : z.date().optional(),
            });
            const parsed = await schema.parseAsync(request.body);
            return parsed;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (request: express.Request): Promise<ParticipantUpdateModel> => {
        try {
            const schema = z.object({
                Prefix          : z.string().max(32).optional(),
                FirstName       : z.string().max(64).optional(),
                LastName        : z.string().max(64).optional(),
                CountryCode     : z.string().max(16).optional(),
                Phone           : z.string().max(16).min(6).optional(),
                Email           : z.string().max(256).email().optional(),
                Gender          : z.nativeEnum(Gender).optional(),
                BirthDate       : z.date().optional(),
                ProfileImageUrl : z.string().max(1024).optional(),
                OnboardingDate  : z.date().optional(),
            });
            const parsed = await schema.parseAsync(request.body);
            const id = await this.validateParamAsUUID(request, 'id');
            return {
                id,
                ...parsed
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request): Promise<ParticipantSearchFilters> => {
        try {
            const schema = z.object({
                clientId : z.string().uuid().optional(),
                name     : z.string().max(64).optional(),
                phone    : z.string().max(12).min(2).optional(),
                email    : z.string().min(3).optional(),
            });
            const parsed = await schema.parseAsync(request.query);
            const filters = this.getSearchFilters(parsed);
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
