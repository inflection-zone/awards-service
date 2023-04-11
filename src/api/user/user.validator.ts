import joi from 'joi';
import express from 'express';
import { ErrorHandler } from '../../common/handlers/error.handler';
import { UserCreateModel, UserResponseDto, UserSearchFilters, UserUpdateModel } from '../../domain.types/user/user.domain.types';
import { Gender, uuid } from '../../domain.types/miscellaneous/system.types';
import { UserService } from '../../database/services/user/user.service';
import { StringUtils } from '../../common/utilities/string.utils';
import { TypeUtils } from '../../common/utilities/type.utils';
import BaseValidator from '../base.validator';

///////////////////////////////////////////////////////////////////////////////////////////////

export class UserValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request): Promise<UserCreateModel> => {
        try {
            const schema = joi.object({
                RoleId      : joi.number().integer().required(),
                ClientId    : joi.string().uuid().required(),
                UserName    : joi.string().max(16).optional(),
                Prefix      : joi.string().max(16).optional(),
                FirstName   : joi.string().max(64).optional(),
                LastName    : joi.string().max(64).optional(),
                CountryCode : joi.string().max(10).optional(),
                Phone       : joi.string().max(16).min(6).required(),
                Email       : joi.string().max(256).email().required(),
                Gender      : joi.string().valid(...Object.values(Gender)).optional(),
                BirthDate   : joi.string().optional(),
                Password    : joi.string().max(512).required(),
            });
            await schema.validateAsync(request.body);
            return this.getValidUserCreateModel(request);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request): Promise<UserSearchFilters> => {
        try {
            const schema = joi.object({
                roleId   : joi.number().positive().optional(),
                prefix   : joi.string().max(16).optional(),
                firstName: joi.string().max(64).optional(),
                lastName : joi.string().max(64).optional(),
                phone    : joi.string().max(16).optional(),
                email    : joi.string().max(256).optional(),
                gender   : joi.string().max(64).optional(),
            });
            await schema.validateAsync(request.query);
            return this.getSearchFilters(request.query);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    getSearchFilters = (query) => {
        var filters = {};
        var roleId = query.roleId ? query.roleId : null;
        if (roleId != null) {
            filters['RoleId'] = roleId;
        }
        var prefix = query.prefix ? query.prefix : null;
        if (prefix != null) {
            filters['Prefix'] = prefix;
        }
        var firstName = query.firstName ? query.firstName : null;
        if (firstName != null) {
            filters['FirstName'] = firstName;
        }
        var lastName = query.lastName ? query.lastName : null;
        if (lastName != null) {
            filters['LastName'] = lastName;
        }
        var phone = query.phone ? query.phone : null;
        if (phone != null) {
            filters['Phone'] = phone;
        }
        var email = query.email ? query.email : null;
        if (email != null) {
            filters['Email'] = email;
        }
        var gender = query.gender ? query.gender : null;
        if (gender != null) {
            filters['Gender'] = gender;
        }
        return filters;
    };

    public validateUpdateRequest = async (request: express.Request): Promise<UserUpdateModel> => {
        try {
            const schema = joi.object({
                RoleId      : joi.number().integer().optional(),
                ClientId    : joi.string().uuid().optional(),
                UserName    : joi.string().max(16).optional(),
                Prefix      : joi.string().max(16).optional(),
                FirstName   : joi.string().max(64).optional(),
                LastName    : joi.string().max(64).optional(),
                CountryCode : joi.string().max(10).optional(),
                Phone       : joi.string().max(16).min(6).optional(),
                Email       : joi.string().max(256).email().optional(),
                Gender      : joi.string().valid(...Object.values(Gender)).optional(),
                BirthDate   : joi.string().optional(),
                Password    : joi.string().max(512).optional(),
            });
            await schema.validateAsync(request.body);
            const id = await this.validateParamAsUUID(request, 'id');
            return await this.getValidUserUpdateModel(id, request);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validatePasswordChangeRequest = async (request: express.Request) => {
        try {
            const schema = joi.object({
                CurrentUserId : joi.string().uuid(),
                OldPassword   : joi.string(),
                NewPassword   : joi.string()
            });
            await schema.validateAsync(request.body);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateResetPasswordLinkRequest = async (request: express.Request) => {
        try {
            const schema = joi.object({
                Email : joi.string().email().min(5)
            });
            await schema.validateAsync(request.body);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSetPasswordRequest = async (request: express.Request) => {
        try {
            const schema = joi.object({
                ResetPasswordToken : joi.string(),
                Password           : joi.string()
            });
            await schema.validateAsync(request.body);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateLoginWithPasswordRequest = async (request: express.Request) => {
        try {
            // const schema = joi.object({
            //     CountryCode : joi.string().max(10).optional(),
            //     Phone       : joi.string().max(16).min(6).optional(),
            //     Email       : joi.string().max(256).optional(),
            //     UserName    : joi.string().max(64).optional(),
            //     Password    : joi.string().max(512).required(),
            // });
            const schema = joi.object({
                Phone       : {
                    CountryCode : joi.string().max(10).optional(),
                    PhoneNumber: joi.string().max(16).min(6).required(),
                },
                Email       : joi.string().max(256).email(),
                UserName    : joi.string().max(64),
                Password    : joi.string().max(512).required(),
            }).xor('Email', 'UserName', 'Phone');
            await schema.validateAsync(request.body);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateLoginWithOtpRequest = async (request: express.Request) => {
        try {
            // const schema = joi.object({
            //     CountryCode : joi.string().max(10).optional(),
            //     Phone       : joi.string().max(16).min(6).optional(),
            //     Email       : joi.string().max(256).optional(),
            //     UserName    : joi.string().max(64).optional(),
            //     Otp         : joi.string().max(10),
            // });
            const schema = joi.object({
                Phone       : {
                    CountryCode : joi.string().max(10).optional(),
                    PhoneNumber: joi.string().max(16).min(6).required(),
                },
                Email       : joi.string().max(256).email(),
                UserName    : joi.string().max(64),
                Otp         : joi.string().max(10).required(),
            }).xor('Email', 'UserName', 'Phone');
            await schema.validateAsync(request.body);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validatePasswordResetRequest = async (request: express.Request) => {
        try {
            const schema = joi.object({
                Email    : joi.string().max(256).optional(),
                UserName : joi.string().max(64).optional(),
            });
            await schema.validateAsync(request.body);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSendOtpRequest = async (request: express.Request) => {
        try {
            const schema = joi.object({
                CountryCode : joi.string().max(10).optional(),
                Phone       : joi.string().max(16).min(6).optional(),
                Email       : joi.string().max(256).optional(),
                UserName    : joi.string().max(64).optional(),
            });
            await schema.validateAsync(request.body);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public getUserCreateModel = (request: express.Request): UserCreateModel => {

        const birthDate = request.body.BirthDate ? new Date(Date.parse(request.body.BirthDate)) : null;

        return {
            RoleId      : request.body.RoleId ? request.body.RoleId : null,
            ClientId    : request.body.ClientId ? request.body.ClientId : null,
            Prefix      : request.body.Prefix ? request.body.Prefix : 'Mr',
            UserName    : request.body.UserName ? request.body.UserName : null,
            FirstName   : request.body.FirstName ? request.body.FirstName : null,
            LastName    : request.body.LastName ? request.body.LastName : null,
            CountryCode : request.body.CountryCode ? request.body.CountryCode : '+91',
            Phone       : request.body.Phone ? request.body.Phone : null,
            Email       : request.body.Email ? request.body.Email : null,
            Gender      : request.body.Gender ? request.body.Gender : 'Male',
            BirthDate   : birthDate,
            Password    : request.body.Password ? request.body.Password : null,
        };
    };

    public getValidUserCreateModel = async (request: express.Request) => {

        const userService = new UserService();

        var password = request.body.Password;
        if (!password) {
            password = StringUtils.generatePassword();
        }
        else {
            userService.validatePasswordCriteria(password);
        }
        request.body.Password = StringUtils.generateHashedPassword(password);

        var userName = request.body.UserName;
        if (!userName) {
            userName = await userService.generateUserNameIfDoesNotExist(request.body.UserName);
        }
        request.body.UserName = userName;

        request.body.CountryCode = request.body.CountryCode ?? "+91";
        var userWithPhone = await userService.getUserWithPhone(request.body.CountryCode, request.body.Phone);
        if (userWithPhone) {
            ErrorHandler.throwDuplicateUserError(`User with phone ${request.body.CountryCode} ${request.body.Phone.toString()} already exists!`);
        }

        var userWithUserName = await userService.getUserWithUserName(request.body.UserName);
        if (userWithUserName) {
            ErrorHandler.throwDuplicateUserError(`User with user-name ${request.body.UserName} already exists!`);
        }

        var userWithEmail = await userService.getUserWithEmail(request.body.Email);
        if (userWithEmail) {
            ErrorHandler.throwDuplicateUserError(`User with email ${request.body.Email} already exists!`);
        }

        var userCreateModel: UserCreateModel = await this.getUserCreateModel(request);
        return userCreateModel;
    };

    public getValidUserUpdateModel = async (id: uuid, request: express.Request) => {

        const userService = new UserService();

        const user: UserResponseDto = await userService.getById(id);
        if (user === null) {
            ErrorHandler.throwNotFoundError('User with id ' + id.toString() + ' cannot be found!');
        }

        const updateModel: any = {};

        if (TypeUtils.hasProperty(request.body, 'Prefix')) {
            updateModel.Prefix = request.body.Prefix;
        }
        if (TypeUtils.hasProperty(request.body, 'FirstName')) {
            updateModel.FirstName = request.body.FirstName;
        }
        if (TypeUtils.hasProperty(request.body, 'LastName')) {
            updateModel.LastName = request.body.LastName;
        }
        if (TypeUtils.hasProperty(request.body, 'CountryCode') && TypeUtils.hasProperty(request.body, 'Phone')) {
            var userWithPhone = await userService.getUserWithPhone(request.body.CountryCode, request.body.Phone);
            if (userWithPhone) {
                ErrorHandler.throwDuplicateUserError(`Other user with phone ${request.body.CountryCode} ${request.body.Phone.toString()} already exists!`);
            }
            updateModel.CountryCode = request.body.CountryCode;
            updateModel.Phone = request.body.Phone;
        }
        else if (TypeUtils.hasProperty(request.body, 'Phone')) {
            var userWithPhone = await userService.getUserWithPhone(user.CountryCode, request.body.Phone);
            if (userWithPhone && user.id !== userWithPhone.id) {
                ErrorHandler.throwDuplicateUserError(`Other user with phone ${user.CountryCode} ${request.body.Phone.toString()} already exists!`);
            }
            updateModel.Phone = request.body.Phone;
        }
        else if (TypeUtils.hasProperty(request.body, 'CountryCode')) {
            var userWithCountryCode = await userService.getUserWithPhone(request.body.CountryCode, user.Phone);
            if (userWithCountryCode && user.id !== userWithCountryCode.id) {
                ErrorHandler.throwDuplicateUserError(`Other user with phone ${request.body.CountryCode} ${user.Phone.toString()} already exists!`);
            }
            updateModel.CountryCode = request.body.CountryCode;
        }
        if (TypeUtils.hasProperty(request.body, 'Email')) {
            var userWithEmail = await userService.getUserWithEmail(request.body.Email);
            if (userWithEmail && user.id !== userWithEmail.id) {
                ErrorHandler.throwDuplicateUserError(`Other user with email ${request.body.Email} already exists!`);
            }
            updateModel.Email = request.body.Email;
        }
        if (TypeUtils.hasProperty(request.body, 'BiocubeId') || TypeUtils.hasProperty(request.body, 'UserName')) {
            var userName = request.body.BiocubeId ?? request.body.UserName;
            var userWithUserName = await userService.getUserWithUserName(userName);
            if (userWithUserName && user.id !== userWithUserName.id) {
                ErrorHandler.throwDuplicateUserError(`Other user with user-name ${request.body.UserName} already exists!`);
            }
            updateModel.BiocubeId = request.body.BiocubeId;
            updateModel.UserName = request.body.UserName;
        }
        if (TypeUtils.hasProperty(request.body, 'Gender')) {
            updateModel.Gender = request.body.Gender;
        }
        if (TypeUtils.hasProperty(request.body, 'Password')) {
            updateModel.Password = StringUtils.generateHashedPassword(request.body.Password);
        }

        return updateModel;
    };

}
