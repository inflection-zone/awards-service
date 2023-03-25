import { Role } from '../../models/user/role.model';
import { RoleCreateModel, RoleResponseDto, RoleSearchFilters, RoleSearchResults, RoleUpdateModel } from '../../../domain.types/user/role.domain.types';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../database.connector';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { BaseService } from '../base.service';
import { RoleMapper } from '../../mappers/user/role.mapper';

///////////////////////////////////////////////////////////////////////

export class RoleService extends BaseService {

    //#region Repositories

    _roleRepository: Repository<Role> = Source.getRepository(Role);

    //#endregion

    public create = async (createModel: RoleCreateModel): Promise<RoleResponseDto> => {
        try {
            const role = this._roleRepository.create({
                Name        : createModel.Name,
                Description : createModel.Description,
            });
            var record = await this._roleRepository.save(role);
            return RoleMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getById = async (id: number): Promise<RoleResponseDto> => {
        try {
            var role = await this._roleRepository.findOne({
                where : {
                    id : id
                }
            });
            return RoleMapper.toResponseDto(role);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: RoleSearchFilters): Promise<RoleSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } =
                this.addSortingAndPagination<Role>(search, filters);
            const [list, count] = await this._roleRepository.findAndCount(search);
            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => RoleMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    public getByRoleName = async (name: string): Promise<RoleResponseDto> =>{
        try {
            var role = await this._roleRepository.findOne({
                where : {
                    Name : name
                }
            });
            return RoleMapper.toResponseDto(role);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to get role record!', error);
        }
    };

    public getAll = async (): Promise<RoleResponseDto[]> =>{
        try {
            var roles = await this._roleRepository.find();
            return roles.map(x => RoleMapper.toResponseDto(x));
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to get role record!', error);
        }
    };

    public update = async (id: number, updateModel: RoleUpdateModel): Promise<RoleResponseDto> => {
        try {
            const role = await this._roleRepository.findOne({
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
            var record = await this._roleRepository.save(role);
            return RoleMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: number): Promise<boolean> => {
        try {
            var record = await this._roleRepository.findOne({
                where : {
                    id : id
                }
            });
            var result = await this._roleRepository.remove(record);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    //#region Privates

    private getSearchModel = (filters: RoleSearchFilters) => {

        var search : FindManyOptions<Role> = {
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
                Privileges  : {
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
