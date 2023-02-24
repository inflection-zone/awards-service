import { Source } from '../../database.connector';
import { User } from '../../models/user/user.model';
import { UserLoginSession } from '../../models/user/user.login.session.model';
import { ErrorHandler } from '../../../common/error.handler';
import { passwordStrength } from 'check-password-strength';
import { Helper } from '../../../common/helper';
import { TimeHelper } from '../../../common/time.helper';
import { DurationType } from '../../../domain.types/miscellaneous/time.types';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { UserCreateModel, UserSearchFilters, UserUpdateModel } from '../../../domain.types/user/user.domain.types';
import { logger } from '../../../logger/logger';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////////////

export class UserService {

    //#region Repositories

    _userRepository: Repository<User> = Source.getRepository(User);

    _userLoginSessionRepository: Repository<UserLoginSession> = Source.getRepository(UserLoginSession);

    //#endregion

    create = async (createModel: UserCreateModel) => {
        try {
            const user = new User();
            Object.assign(user, createModel);
            var record = await this._userRepository.save(user);
            return await this.getById(record.id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to create user!', error);
        }
    };

    getById = async (id) => {
        try {
            var user = await this._userRepository.findOne({
                where : {
                    id : id
                }
            });
            return user;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to retrieve user!', error);
        }
    };

    exists = async (id) => {
        try {
            const record = await this._userRepository.findOne({
                where : {
                    id : id
                }
            });
            return record !== null;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to determine existance of user!', error);
        }
    };

    search = async (filters: UserSearchFilters) => {
        try {

            var search : FindManyOptions<User> = {
                relations : {
                },
                where : {
                },
                select : {
                    id              : true,
                    Prefix          : true,
                    FirstName       : true,
                    LastName        : true,
                    Gender          : true,
                    UserName        : true,
                    CreatedAt       : true,
                    ProfileImageUrl : true,
                    BirthDate       : true,
                    CountryCode     : true,
                    Phone           : true,
                    Email           : true,
                    Client          : {
                        id   : true,
                        Code : true,
                        Name : true,
                    }
                }
            };

            if (filters.ClientId) {
                search.relations['Client'] = true;
                search.where['Client'] = {
                    id : filters.ClientId
                };
            }
            if (filters.FirstName) {
                search.where['FirstName'] =  Like(`%${filters.FirstName}%`);
            }

            if (filters.LastName) {
                search.where['LastName'] =  Like(`%${filters.LastName}%`);
            }

            if (filters.Phone) {
                search.where['Phone'] = Like(`%${filters.Phone}%`);
            }

            if (filters.Email) {
                search.where['Email'] = Like(`%${filters.Email}%`);
            }

            //Sorting
            let orderByColumn = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColumn = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = {};
            search['order'][orderByColumn] = order;

            //Pagination
            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['take'] = limit;
            search['skip'] = offset;

            const [list, count] = await this._userRepository.findAndCount(search);
            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list,
            };

            return searchResults;

        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to search user records!', error);
        }
    };

    update = async (id, updateModel) => {
        try {
            if (Object.keys(updateModel).length > 0) {
                var res = await this._userRepository.update({
                    id : id
                },
                updateModel);
                logger.info(`Update SQL Query : ${res.raw}`);
            }
            return await this.getById(id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to update user!', error);
        }
    };

    delete = async (id) => {
        try {
            var record = await this._userRepository.findOne({
                where : {
                    id : id
                }
            });
            var result = await this._userRepository.remove(record);
            return result != null;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to delete user!', error);
        }
    };

    getUserWithPhone = async (countryCode, phone) => {
        try {
            const record = await this._userRepository.findOne({
                where : {
                    Phone       : phone,
                    CountryCode : countryCode
                }
            });
            return record;
        } catch (error) {
            ErrorHandler.throwDbAccessError('Unable to check if user exists with phone!', error);
        }
    };

    getUserWithEmail = async (email) => {
        try {
            const record = await this._userRepository.findOne({
                where : {
                    Email : email
                }
            });
            return record;
        } catch (error) {
            ErrorHandler.throwDbAccessError('Unable to check if user exists with email!', error);
        }
    };

    getUserWithUserName = async (username) => {
        try {
            const record = await this._userRepository.findOne({
                where : {
                    UserName : username
                }
            });
            return record;
        } catch (error) {
            ErrorHandler.throwDbAccessError('Unable to check username!', error);
        }
    };

    generateUserNameIfDoesNotExist = async (userName: string) => {
        var tmpUsername = userName ?? Helper.generateUserName();
        while (await this.getUserWithUserName(tmpUsername) != null) {
            tmpUsername = Helper.generateUserName();
        }
        return tmpUsername;
    };

    getUser = async (
        countryCode,
        phone,
        email,
        userName
    ) => {

        if (phone !== null && countryCode !== null) {
            const user = await this._userRepository.findOne({
                where : {
                    Phone       : phone,
                    CountryCode : countryCode
                }
            });
            if (user != null) {
                return user;
            }
        }

        else if (email !== null) {
            const user = await this._userRepository.findOne({
                where : {
                    Email : email,
                }
            });
            if (user != null) {
                return user;
            }
        }
        else if (userName !== null) {
            const user = await this._userRepository.findOne({
                where : {
                    UserName : userName,
                }
            });
            if (user != null) {
                return user;
            }
        }
        return null;
    };

    getUserUpdateModel = (inputModel: UserUpdateModel) => {

        var updateModel: any = {};

        if (Helper.hasProperty(inputModel, 'Prefix')) {
            updateModel.Prefix = inputModel.Prefix;
        }
        if (Helper.hasProperty(inputModel, 'FirstName')) {
            updateModel.FirstName = inputModel.FirstName;
        }
        if (Helper.hasProperty(inputModel, 'LastName')) {
            updateModel.LastName = inputModel.LastName;
        }
        if (Helper.hasProperty(inputModel, 'Phone')) {
            updateModel.Phone = inputModel.Phone;
        }
        if (Helper.hasProperty(inputModel, 'Email')) {
            updateModel.Email = inputModel.Email;
        }
        if (Helper.hasProperty(inputModel, 'ProfileImageUrl')) {
            updateModel.ImageUrl = inputModel.ProfileImageUrl;
        }
        if (Helper.hasProperty(inputModel, 'Gender')) {
            updateModel.Gender = inputModel.Gender;
        }
        if (Helper.hasProperty(inputModel, 'BirthDate')) {
            updateModel.BirthDate = inputModel.BirthDate;
        }

        return updateModel;
    };

    createUserLoginSession = async (userId) => {
        try {
            var now = new Date();
            var till = TimeHelper.addDuration(now, 3, DurationType.Day);
            var user = await this._userRepository.findOne({
                where : {
                    id : userId
                }
            });
            if (!user) {
                ErrorHandler.throwNotFoundError('User not found!');
            }
            var session = await this._userLoginSessionRepository.create({
                User      : user,
                IsActive  : true,
                StartedAt : now,
                ValidTill : till
            });
            var record = await this._userLoginSessionRepository.save(session);
            return record;
        } catch (error) {
            ErrorHandler.throwDbAccessError('Unable to create user login session!', error);
        }
    };

    invalidateUserLoginSession = async (sessionId) => {
        try {
            var session = await this._userLoginSessionRepository.findOne({
                where : {
                    id : sessionId
                }
            });
            if (!session) {
                ErrorHandler.throwNotFoundError('User login session not found!');
            }
            session.IsActive = false;
            session.ValidTill = new Date();
            var record = await this._userLoginSessionRepository.save(session);
            return record;
        } catch (error) {
            ErrorHandler.throwDbAccessError('Unable to invalidate user login session!', error);
        }
    };

    isValidUserLoginSession = async (sessionId) => {
        try {
            var session = await this._userLoginSessionRepository.findOne({
                where : {
                    id : sessionId
                }
            });
            if (session == null) {
                return false;
            }
            if (session.ValidTill < new Date()) {
                return false;
            }
            if (session.IsActive === false) {
                return false;
            }
            return true;
        } catch (error) {
            ErrorHandler.throwDbAccessError('Unable to determine validity of user login session!', error);
        }
    };

    resetPassword = async (userId: uuid, hashedPassword: string) => {
        try {
            var user = await this._userRepository.findOne({
                where : {
                    id : userId
                }
            });
            if (!user) {
                ErrorHandler.throwNotFoundError('User not found!');
            }
            user.Password = hashedPassword;
            return await this._userRepository.save(user);
        } catch (error) {
            ErrorHandler.throwDbAccessError('Unable to reset password!', error);
        }
    };

    validatePasswordCriteria = (password) => {
        var strength = passwordStrength(password);
        if (strength.length < 8 || strength.contains.length < 4) {
            //Criteria is min 8 characters and contains minimum diversities such as
            //'lowercase', 'uppercase', 'symbol', 'number'
            ErrorHandler.throwInputValidationError(['Password does not match security criteria!']);
        }
    };

}
