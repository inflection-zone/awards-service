import { SchemaInstance } from '../../models/engine/schema.instance.model';
import { Schema } from '../../models/engine/schema.model';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../../database/database.connector';
import { FindManyOptions, Repository } from 'typeorm';
import { SchemaInstanceMapper } from '../../mappers/engine/schema.instance.mapper';
import { BaseService } from '../base.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import {
    SchemaInstanceCreateModel,
    SchemaInstanceResponseDto,
    SchemaInstanceSearchFilters,
    SchemaInstanceSearchResults,
    SchemaInstanceUpdateModel } from '../../../domain.types/engine/schema.instance.types';
import { Context } from '../../models/engine/context.model';

///////////////////////////////////////////////////////////////////////

export class SchemaInstanceService extends BaseService {

    //#region Repositories

    _schemaInstanceRepository: Repository<SchemaInstance> = Source.getRepository(SchemaInstance);

    _schemaRepository: Repository<Schema> = Source.getRepository(Schema);

    _contextRepository: Repository<Context> = Source.getRepository(Context);

    //#endregion

    public create = async (createModel: SchemaInstanceCreateModel)
        : Promise<SchemaInstanceResponseDto> => {

        const schema = await this.getSchema(createModel.SchemaId);
        const context = await this.getContext(createModel.ContextId);

        const schemaInstance = this._schemaInstanceRepository.create({
            Schema  : schema,
            Context : context,
        });
        var record = await this._schemaInstanceRepository.save(schemaInstance);
        return SchemaInstanceMapper.toResponseDto(record);
    };

    public getById = async (id: uuid): Promise<SchemaInstanceResponseDto> => {
        try {
            var schemaInstance = await this._schemaInstanceRepository.findOne({
                where : {
                    id : id
                }
            });
            return SchemaInstanceMapper.toResponseDto(schemaInstance);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getByContextId = async (contextId: uuid): Promise<SchemaInstanceResponseDto[]> => {
        try {
            var instances = await this._schemaInstanceRepository.find({
                where : {
                    Context : {
                        id : contextId
                    }
                }
            });
            return instances.map(x => SchemaInstanceMapper.toResponseDto(x));
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: SchemaInstanceSearchFilters)
        : Promise<SchemaInstanceSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._schemaInstanceRepository.findAndCount(search);
            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => SchemaInstanceMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    public update = async (id: uuid, model: SchemaInstanceUpdateModel)
        : Promise<SchemaInstanceResponseDto> => {
        try {
            const schemaInstance = await this._schemaInstanceRepository.findOne({
                where : {
                    id : id
                }
            });
            if (!schemaInstance) {
                ErrorHandler.throwNotFoundError('SchemaInstance not found!');
            }
            if (model.SchemaId != null) {
                const schema = await this.getSchema(model.SchemaId);
                schemaInstance.Schema = schema;
            }
            if (model.ContextId != null) {
                const context = await this.getContext(model.ContextId);
                schemaInstance.Context = context;
            }
            var record = await this._schemaInstanceRepository.save(schemaInstance);
            return SchemaInstanceMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._schemaInstanceRepository.findOne({
                where : {
                    id : id
                }
            });
            var result = await this._schemaInstanceRepository.remove(record);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    //#region Privates

    private getSearchModel = (filters: SchemaInstanceSearchFilters) => {

        var search : FindManyOptions<SchemaInstance> = {
            relations : {
            },
            where : {
            },
            select : {
                id     : true,
                Schema : {
                    id          : true,
                    Name        : true,
                    Description : true,
                    Client      : {
                        id   : true,
                        Name : true,
                    }
                },
                Context : {
                    id          : true,
                    ReferenceId : true,
                    Type        : true,
                    Participant : {
                        id          : true,
                        ReferenceId : true,
                        Prefix      : true,
                        FirstName   : true,
                        LastName    : true,
                    },
                    Group : {
                        id          : true,
                        Name        : true,
                        Description : true,
                    },
                },
                RootNodeInstance : {
                    id   : true,
                    Node : {
                        id   : true,
                        Name : true,
                    },
                },
                CurrentNodeInstance : {
                    id   : true,
                    Node : {
                        id   : true,
                        Name : true,
                    },
                },
                NodeInstances : {
                    id   : true,
                    Node : {
                        id   : true,
                        Name : true,
                    },
                },
                CreatedAt : true,
                UpdatedAt : true,
            }
        };

        if (filters.SchemaId) {
            search.where['Schema'].id = filters.SchemaId;
        }
        if (filters.ContextId) {
            search.where['Context'].id = filters.ContextId;
        }

        return search;
    };

    //#endregion

    private async getSchema(schemaId: uuid) {
        const schema = await this._schemaRepository.findOne({
            where : {
                id : schemaId
            }
        });
        if (!schema) {
            ErrorHandler.throwNotFoundError('Schema cannot be found');
        }
        return schema;
    }

    private async getContext(contextId: uuid) {
        const context = await this._contextRepository.findOne({
            where : {
                id : contextId
            }
        });
        if (!context) {
            ErrorHandler.throwNotFoundError('Context cannot be found');
        }
        return context;
    }

}
