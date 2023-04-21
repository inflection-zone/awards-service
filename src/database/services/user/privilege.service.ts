import { Privilege } from '../../models/user/privilege.model';
import { PrivilegeCreateModel, PrivilegeResponseDto, PrivilegeSearchFilters, PrivilegeSearchResults, PrivilegeUpdateModel } from '../../../domain.types/user/privilege.domain.types';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../database.connector';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { BaseService } from '../base.service';
import { PrivilegeMapper } from '../../mappers/user/privilege.mapper';
import { Role } from '../../models/user/role.model';

///////////////////////////////////////////////////////////////////////

export class PrivilegeService extends BaseService {

    //#region Repositories

    _privilegeRepository: Repository<Privilege> = Source.getRepository(Privilege);

    _roleRepository: Repository<Role> = Source.getRepository(Role);

    //#endregion

    public create = async (createModel: PrivilegeCreateModel): Promise<PrivilegeResponseDto> => {
        try {
            const privilege = this._privilegeRepository.create({
                Name        : createModel.Name,
                Description : createModel.Description,
            });
            var record = await this._privilegeRepository.save(privilege);
            return PrivilegeMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getById = async (id: uuid): Promise<PrivilegeResponseDto> => {
        try {
            var role = await this._privilegeRepository.findOne({
                where : {
                    id : id
                }
            });
            return PrivilegeMapper.toResponseDto(role);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public addToRole = async (privilegeId: uuid, roleId: number): Promise<PrivilegeResponseDto> => {
        try {
            var privilege = await this._privilegeRepository.findOne({
                where : {
                    id : privilegeId
                },
                select : {
                    id          : true,
                    Name        : true,
                    Description : true,
                    Roles       : true,
                }
            });
            var role = await this._roleRepository.findOne({
                where : {
                    id : roleId
                }
            });
            if (!privilege.Roles) {
                privilege.Roles = [];
            }
            privilege.Roles.push(role);
            const privilege_ = await this._privilegeRepository.save(privilege);
            return PrivilegeMapper.toResponseDto(privilege_);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: PrivilegeSearchFilters): Promise<PrivilegeSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn }
                = this.addSortingAndPagination<Privilege>(search, filters);
            const [list, count] = await this._privilegeRepository.findAndCount(search);
            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => PrivilegeMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    public getByPrivilegeName = async (name: string): Promise<PrivilegeResponseDto> =>{
        try {
            var role = await this._privilegeRepository.findOne({
                where : {
                    Name : name
                }
            });
            return PrivilegeMapper.toResponseDto(role);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to get role record!', error);
        }
    };

    public update = async (id: uuid, updateModel: PrivilegeUpdateModel): Promise<PrivilegeResponseDto> => {
        try {
            const role = await this._privilegeRepository.findOne({
                where : {
                    id : id
                }
            });
            if (!role) {
                ErrorHandler.throwNotFoundError('role not found!');
            }
            if (updateModel.Name != null) {
                role.Name = updateModel.Name;
            }
            if (updateModel.Description != null) {
                role.Description = updateModel.Description;
            }
            var record = await this._privilegeRepository.save(role);
            return PrivilegeMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: uuid): Promise<boolean> => {
        try {
            var record = await this._privilegeRepository.findOne({
                where : {
                    id : id
                }
            });
            var result = await this._privilegeRepository.remove(record);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    //#region Privates

    private getSearchModel = (filters: PrivilegeSearchFilters) => {

        var search : FindManyOptions<Privilege> = {
            relations : {
            },
            where : {
            },
            select : {
                id          : true,
                Name        : true,
                Description : true,
                CreatedAt   : true,
                UpdatedAt   : true,
                Roles       : {
                    id          : true,
                    Name        : true,
                    Description : true,
                }
            }
        };

        if (filters.Name) {
            search.where['Name'] = Like(`%${filters.Name}%`);
        }

        return search;
    };

    //#endregion

}
