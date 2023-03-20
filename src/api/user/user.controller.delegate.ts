import { UserService } from '../../database/services/user/user.service';
import { ErrorHandler } from '../../common/handlers/error.handler';
import { Helper } from '../../common/helper';
import { ApiError } from '../../common/handlers/error.handler';
import { UserValidator } from './user.validator';
import {
    UserResponseDto,
    UserSearchFilters,
    UserSearchResults,
    UserUpdateModel
} from '../../domain.types/user/user.domain.types';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { Loader } from '../../startup/loader';
import { CurrentUser } from '../../domain.types/miscellaneous/current.user';
import { RoleService } from '../../database/services/user/role.service';
import { StringUtils } from '../../common/utilities/string.utils';

///////////////////////////////////////////////////////////////////////////////////////

export class UserControllerDelegate {

    //#region member variables and constructors

    _service: UserService = new UserService();

    _roleService: RoleService = new RoleService();

    _validator: UserValidator = new UserValidator();

    //#endregion

    create = async (requestBody: any) => {

        const userCreateModel = await this._validator.validateCreateRequest(requestBody);

        const record: UserResponseDto = await this._service.create(userCreateModel);
        if (record === null) {
            ErrorHandler.throwInternalServerError('Unable to create user!', 400);
        }

        // if (requestBody.CurrentUserId && dto.Email) {
        //     sendOnboardingEmail(dto, password)
        // }

        return this.getEnrichedDto(record);
    };

    getById = async (id: uuid) => {
        const record: UserResponseDto = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('User with id ' + id.toString() + ' cannot be found!');
        }
        return this.getEnrichedDto(record);
    };

    search = async (query) => {
        var filters: UserSearchFilters = await this._validator.validateSearchRequest(query);
        var searchResults: UserSearchResults = await this._service.search(filters);
        return searchResults;
    };

    update = async (id: uuid, requestBody: any) => {
        const updateModel: UserUpdateModel = await this._validator.validateUpdateRequest(requestBody);
        const updated: UserResponseDto = await this._service.update(id, updateModel);
        if (updated == null) {
            ErrorHandler.throwInternalServerError('Unable to update user!', 400);
        }
        return updated;
    };

    delete = async (id: uuid) => {
        const record: UserResponseDto = await this._service.getById(id);
        if (record == null) {
            ErrorHandler.throwNotFoundError('User with id ' + id.toString() + ' cannot be found!');
        }
        const userDeleted: boolean = await this._service.delete(id);
        return {
            Deleted : userDeleted
        };
    };

    loginWithPassword = async (requestBody) => {
        await this._validator.validateLoginWithPasswordRequest(requestBody);
        const loginModel = await this.getLoginModel(requestBody);
        const sentPassword = loginModel.Password;
        const hashedPassword = loginModel.User.Password;
        const validPassword = StringUtils.compareHashedPassword(sentPassword, hashedPassword);
        if (!validPassword) {
            ErrorHandler.throwUnauthorizedUserError('Invalid password.');
        }
        const user: UserResponseDto = await this._service.getById(loginModel.User.id);
        const loginSession = await this._service.createUserLoginSession(user.id);
        const currentUser: CurrentUser = this.constructCurrentUser(user, loginSession.id);
        const accessToken = await Loader.Authorizer.generateUserSessionToken(currentUser);
        return {
            User        : currentUser,
            AccessToken : accessToken
        };
    };

    // loginWithOtp = async (requestBody) => {
    //     await this._validator.validateLoginWithOtpRequest(requestBody);
    //     const loginModel = await this.getLoginModel(requestBody);
    //     const latestOtp = await this._otpService.getLatestActiveOtp(loginModel.User.id);
    //     if (latestOtp == null) {
    //         ErrorHandler.throwUnauthorizedUserError('Invalid OTP');
    //     }
    //     if (latestOtp.ValidTill < new Date()) {
    //         ErrorHandler.throwUnauthorizedUserError('Otp has expired. Please regenerate OTP again!');
    //     }
    //     if (latestOtp.Otp !== loginModel.Otp) {
    //         ErrorHandler.throwUnauthorizedUserError('Invalid OTP. Please try again!');
    //     }

    //     // mark OTP as used
    //     this._otpService.markAsUsed(latestOtp.id);

    //     const user = await this._service.getById(loginModel.User.id);
    //     const loginSession = await this._service.createUserLoginSession(user.id);
    //     const currentUser: CurrentUser = this.constructCurrentUser(user, loginSession.id);
    //     const accessToken = await Loader.Authorizer.generateUserSessionToken(currentUser);
    //     currentUser['ImageUrl'] = user.ImageUrl ?? '';
    //     return {
    //         User        : currentUser,
    //         AccessToken : accessToken
    //     };
    // }

    changePassword = async (requestBody) => {
        await this._validator.validatePasswordChangeRequest(requestBody);
        const passwordResetModel = await this.getPasswordChangeModel(requestBody);
        const existingHashedPassword = await this._service.getUserHashedPassword(requestBody.CurrentUserId);
        const validPassword = StringUtils.compareHashedPassword(
            passwordResetModel.OldPassword,
            existingHashedPassword);
        if (!validPassword) {
            ErrorHandler.throwUnauthorizedUserError('Invalid old password!');
        }
        const newHashedPassword = StringUtils.generateHashedPassword(passwordResetModel.NewPassword);
        return await this._service.resetPassword(passwordResetModel.User.id, newHashedPassword);
    };

    // sendOtp = async (requestBody) => {
    //     await this._validator.validateSendOtpRequest(requestBody);
    //     const countryCode = (typeof requestBody.CountryCode !== undefined) ? requestBody.CountryCode : '+91';
    //     const phone = (typeof requestBody.Phone !== undefined) ? requestBody.Phone : null;
    //     const user = await this._service.getUser(countryCode, phone, null, null);
    //     if (user === null) {
    //         ErrorHandler.throwNotFoundError('User does not exist!');
    //     }
    //     const otp = await this._otpService.create(user.id, requestBody.Purpose ?? 'Login');
    //     if (otp != null) {
    //         const appIdentifier = 'LMS';
    //         const phoneStr = countryCode + '-' + phone;
    //         const message =
    // `Dear ${user.FirstName}, ${otp.Otp} is OTP for your ${appIdentifier} login and will expire in 10 mins.`;
    //         const sendStatus = await this._smsService.sendSMS(phoneStr, message);
    //         if (sendStatus) {
    //             logger.log('Otp sent successfully.\n ' + JSON.stringify(otp, null, 2));
    //         }
    //         return true;
    //     }
    //     return false;
    // }

    logout = async (userId, sessionId) => {
        await this._service.invalidateUserLoginSession(sessionId);
    };

    getRoleTypes = async () => {
        const roles = await this._roleService.getAll();
        return roles;
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////



    //This function returns a response DTO which is enriched with available resource data

    getEnrichedDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            id                  : record.id,
            BiocubeId           : record.BiocubeId,
            UserName            : record.UserName,
            RoleId              : record.RoleId,
            Prefix              : record.Prefix,
            FirstName           : record.FirstName,
            LastName            : record.LastName,
            CountryCode         : record.CountryCode,
            Phone               : record.Phone,
            Email               : record.Email,
            Gender              : record.Gender,
            BirthDate           : record.BirthDate,
            State               : record.State,
            Country             : record.Country,
            Address             : record.Address,
            AddedByUserId       : record.AddedByUserId,
            LastUpdatedByUserId : record.LastUpdatedByUserId
        };
    };

    //This function returns a response DTO which has only public parameters

    getPublicDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            id          : record.id,
            RoleId      : record.RoleId,
            UserName    : record.UserName,
            Prefix      : record.Prefix,
            FirstName   : record.FirstName,
            LastName    : record.LastName,
            CountryCode : record.CountryCode,
            Phone       : record.Phone,
            Email       : record.Email,
            Gender      : record.Gender,
            BirthDate   : record.BirthDate,
        };
    };

    getLoginModel = async (requestBody) => {

        const countryCode = (typeof requestBody.CountryCode !== 'undefined') ? requestBody.CountryCode : '+91';
        const phone = (typeof requestBody.Phone !== 'undefined') ? requestBody.Phone : null;
        const email = (typeof requestBody.Email !== 'undefined') ? requestBody.Email : null;
        const userName = (typeof requestBody.UserName !== 'undefined') ? requestBody.UserName : null;
        const password = (typeof requestBody.Password !== 'undefined') ? requestBody.Password : null;
        const otp = (typeof requestBody.Otp !== 'undefined') ? requestBody.Otp.toString() : null;

        const user = await this._service.getUser(countryCode, phone, email, userName);
        if (user === null) {
            ErrorHandler.throwNotFoundError('User does not exist!');
        }

        return {
            User     : user,
            Password : password,
            Otp      : otp
        };
    };

    getPasswordChangeModel = async (requestBody) => {
        const oldPassword = requestBody.OldPassword;
        const newPassword = requestBody.NewPassword;
        const user = await this._service.getById(requestBody.CurrentUserId);
        if (user === null) {
            ErrorHandler.throwNotFoundError('User does not exist!');
        }
        return {
            User        : user,
            OldPassword : oldPassword,
            NewPassword : newPassword,
        };
    };

    constructCurrentUser = (user, sessionId): CurrentUser => {
        return {
            UserId        : user.id,
            UserName      : user.UserName,
            CurrentRoleId : user.RoleId,
            DisplayName   : Helper.getFullName(user.Prefix, user.FirstName, user.LastName),
            SessionId     : sessionId,
            Phone         : user.CountryCode + '-' + user.Phone,
            Email         : user.Email
        };
    };

}
