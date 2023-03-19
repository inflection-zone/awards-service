import z from 'zod';
import { ErrorHandler } from '../../common/handlers/error.handler';
import { UserCreateModel } from '../../domain.types/user/user.domain.types';
import { Gender } from '../../domain.types/miscellaneous/system.types';
import { UserService } from '../../database/repository.services/user/user.service';
import { StringUtils } from '../../common/utilities/string.utils';
import { TypeUtils } from '../../common/utilities/type.utils';

///////////////////////////////////////////////////////////////////////////////////////////////

export class UserValidator {

    static validateCreateRequest = async (requestBody: any) => {
        try {
            const schema = z.object({
                UserName    : z.string().max(16).optional(),
                Prefix      : z.string().max(16).optional(),
                FirstName   : z.string().max(64).optional(),
                LastName    : z.string().max(64).optional(),
                CountryCode : z.string().max(10).optional(),
                Phone       : z.string().max(16).min(6),
                Email       : z.string().max(256),
                Gender      : z.nativeEnum(Gender),
                BirthDate   : z.string().optional(),
                Password    : z.string().max(512),
                State       : z.string().max(64).optional(),
                Country     : z.string().max(64).optional(),
                Address     : z.string().max(256).optional()
            });
            await schema.parseAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static validateSearchRequest = async (query) => {
        try {
            const schema = z.object({
                prefix              : z.string().max(16).optional(),
                firstName           : z.string().max(64).optional(),
                lastName            : z.string().max(64).optional(),
                gender              : z.nativeEnum(Gender).optional(),
                state               : z.string().max(64).optional(),
                country             : z.string().max(64).optional(),
                address             : z.string().max(256).optional(),
                addedByUserId       : z.string().uuid().optional(),
                lastUpdatedByUserId : z.string().uuid().optional()
            });
            await schema.parseAsync(query);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static validateUpdateRequest = async (requestBody) => {
        try {
            const schema = z.object({
                Prefix      : z.string().max(16).optional(),
                FirstName   : z.string().max(64).optional(),
                LastName    : z.string().max(64).optional(),
                CountryCode : z.string().max(10).optional(),
                Phone       : z.string().max(16).min(6).optional(),
                Email       : z.string().max(256).optional(),
                BiocubeId   : z.string().max(32).optional(),
                Gender      : z.nativeEnum(Gender).optional(),
                Password    : z.string().max(512).optional(),
                State       : z.string().max(64).optional(),
                Country     : z.string().max(64).optional(),
                Address     : z.string().max(256).optional()
            });
            await schema.parseAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static validatePasswordChangeRequest = async (requestBody) => {
        try {
            const schema = z.object({
                CurrentUserId : z.string().uuid(),
                OldPassword   : z.string(),
                NewPassword   : z.string()
            });
            await schema.parseAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static validateResetPasswordLinkRequest = async (requestBody) => {
        try {
            const schema = z.object({
                Email : z.string().email().min(5)
            });
            await schema.parseAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static validateSetPasswordRequest = async (requestBody) => {
        try {
            const schema = z.object({
                ResetPasswordToken : z.string(),
                Password           : z.string()
            });
            await schema.parseAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static validateLoginWithPasswordRequest = async (requestBody) => {
        try {
            const schema = z.object({
                CountryCode : z.string().max(10).optional(),
                Phone       : z.string().max(16).min(6).optional(),
                Email       : z.string().max(256).optional(),
                UserName    : z.string().max(64).optional(),
                Password    : z.string().max(512),
            });
            await schema.parseAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static validateLoginWithOtpRequest = async (requestBody) => {
        try {
            const schema = z.object({
                CountryCode : z.string().max(10).optional(),
                Phone       : z.string().max(16).min(6).optional(),
                Email       : z.string().max(256).optional(),
                UserName    : z.string().max(64).optional(),
                Otp         : z.string().max(10),
            });
            await schema.parseAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static validatePasswordResetRequest = async (requestBody) => {
        try {
            const schema = z.object({
                Email    : z.string().max(256).optional(),
                UserName : z.string().max(64).optional(),
            });
            await schema.parseAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static validateSendOtpRequest = async (requestBody) => {
        try {
            const schema = z.object({
                CountryCode : z.string().max(10).optional(),
                Phone       : z.string().max(16).min(6).optional(),
                Email       : z.string().max(256).optional(),
                UserName    : z.string().max(64).optional(),
            });
            await schema.parseAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static getUserCreateModel = (requestBody): UserCreateModel => {

        const birthDate = requestBody.BirthDate ? Date.parse(requestBody.BirthDate) : null;

        return {
            RoleId      : requestBody.RoleId ? requestBody.RoleId : null,
            Prefix      : requestBody.Prefix ? requestBody.Prefix : 'Mr',
            UserName    : requestBody.UserName ? requestBody.UserName : null,
            FirstName   : requestBody.FirstName ? requestBody.FirstName : null,
            LastName    : requestBody.LastName ? requestBody.LastName : null,
            CountryCode : requestBody.CountryCode ? requestBody.CountryCode : '+91',
            Phone       : requestBody.Phone ? requestBody.Phone : null,
            Email       : requestBody.Email ? requestBody.Email : null,
            Gender      : requestBody.Gender ? requestBody.Gender : 'Male',
            BirthDate   : new Date(birthDate),
            Password    : requestBody.Password ? requestBody.Password : null,
        };
    };

    static getValidUserCreateModel = async (requestBody) => {

        const userService = new UserService();

        var password = requestBody.Password;
        if (!password) {
            password = StringUtils.generatePassword();
        }
        else {
            userService.validatePasswordCriteria(password);
        }
        requestBody.Password = StringUtils.generateHashedPassword(password);

        var userName = requestBody.UserName;
        if (!userName) {
            userName = await userService.generateUserNameIfDoesNotExist(requestBody.UserName);
        }
        requestBody.UserName = userName;

        requestBody.CountryCode = requestBody.CountryCode ?? "+91";
        var userWithPhone = await userService.getUserWithPhone(requestBody.CountryCode, requestBody.Phone);
        if (userWithPhone) {
            ErrorHandler.throwDuplicateUserError(`User with phone ${requestBody.CountryCode} ${requestBody.Phone.toString()} already exists!`);
        }

        var userWithUserName = await userService.getUserWithUserName(requestBody.UserName);
        if (userWithUserName) {
            ErrorHandler.throwDuplicateUserError(`User with user-name ${requestBody.UserName} already exists!`);
        }

        var userWithEmail = await userService.getUserWithEmail(requestBody.Email);
        if (userWithEmail) {
            ErrorHandler.throwDuplicateUserError(`User with email ${requestBody.Email} already exists!`);
        }

        var userCreateModel: UserCreateModel = await this.getUserCreateModel(requestBody);
        return { userCreateModel, password };
    };

    static getValidUserUpdateModel = async (user, requestBody) => {

        const userService = new UserService();

        const updateModel: any = {};

        if (TypeUtils.hasProperty(requestBody, 'Prefix')) {
            updateModel.Prefix = requestBody.Prefix;
        }
        if (TypeUtils.hasProperty(requestBody, 'FirstName')) {
            updateModel.FirstName = requestBody.FirstName;
        }
        if (TypeUtils.hasProperty(requestBody, 'LastName')) {
            updateModel.LastName = requestBody.LastName;
        }
        if (TypeUtils.hasProperty(requestBody, 'CountryCode') && TypeUtils.hasProperty(requestBody, 'Phone')) {
            var userWithPhone = await userService.getUserWithPhone(requestBody.CountryCode, requestBody.Phone);
            if (userWithPhone) {
                ErrorHandler.throwDuplicateUserError(`Other user with phone ${requestBody.CountryCode} ${requestBody.Phone.toString()} already exists!`);
            }
            updateModel.CountryCode = requestBody.CountryCode;
            updateModel.Phone = requestBody.Phone;
        }
        else if (TypeUtils.hasProperty(requestBody, 'Phone')) {
            var userWithPhone = await userService.getUserWithPhone(user.CountryCode, requestBody.Phone);
            if (userWithPhone && user.id !== userWithPhone.id) {
                ErrorHandler.throwDuplicateUserError(`Other user with phone ${user.CountryCode} ${requestBody.Phone.toString()} already exists!`);
            }
            updateModel.Phone = requestBody.Phone;
        }
        else if (TypeUtils.hasProperty(requestBody, 'CountryCode')) {
            var userWithCountryCode = await userService.getUserWithPhone(requestBody.CountryCode, user.Phone);
            if (userWithCountryCode && user.id !== userWithCountryCode.id) {
                ErrorHandler.throwDuplicateUserError(`Other user with phone ${requestBody.CountryCode} ${user.Phone.toString()} already exists!`);
            }
            updateModel.CountryCode = requestBody.CountryCode;
        }
        if (TypeUtils.hasProperty(requestBody, 'Email')) {
            var userWithEmail = await userService.getUserWithEmail(requestBody.Email);
            if (userWithEmail && user.id !== userWithEmail.id) {
                ErrorHandler.throwDuplicateUserError(`Other user with email ${requestBody.Email} already exists!`);
            }
            updateModel.Email = requestBody.Email;
        }
        if (TypeUtils.hasProperty(requestBody, 'BiocubeId') || TypeUtils.hasProperty(requestBody, 'UserName')) {
            var userName = requestBody.BiocubeId ?? requestBody.UserName;
            var userWithUserName = await userService.getUserWithUserName(userName);
            if (userWithUserName && user.id !== userWithUserName.id) {
                ErrorHandler.throwDuplicateUserError(`Other user with user-name ${requestBody.UserName} already exists!`);
            }
            updateModel.BiocubeId = requestBody.BiocubeId;
            updateModel.UserName = requestBody.UserName;
        }
        if (TypeUtils.hasProperty(requestBody, 'Gender')) {
            updateModel.Gender = requestBody.Gender;
        }
        if (TypeUtils.hasProperty(requestBody, 'Password')) {
            updateModel.Password = StringUtils.generateHashedPassword(requestBody.Password);
        }

        return updateModel;
    };

}
