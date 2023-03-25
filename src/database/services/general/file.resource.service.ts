import { FileResource } from '../../models/general/file.resource.model';
import { User } from '../../models/user/user.model';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import {
    FileResourceCreateModel,
    FileResourceResponseDto,
    FileResourceSearchFilters,
    FileResourceSearchResults
} from '../../../domain.types/general/file.resource.domain.types';
import { Source } from '../../../database/database.connector';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { FileResourceMapper } from '../../mappers/general/file.resource.mapper';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { logger } from '../../../logger/logger';

///////////////////////////////////////////////////////////////////////////////////////////////

export class FileResourceService {

    //#region Models

    _fileResourceRepository : Repository<FileResource> = Source.getRepository(FileResource);

    _userRepository : Repository<User> = Source.getRepository(User);

    //#endregion

    //#region Publics

    create = async (createModel: FileResourceCreateModel): Promise<FileResourceResponseDto> => {
        try {
            var fileResource = new FileResource();
            var uploadedBy = null;
            if (createModel.UserId) {
                uploadedBy = await this._userRepository.findOne({
                    where : {
                        id : createModel.UserId
                    }
                });
            }

            fileResource.OriginalFilename = createModel.OriginalFilename;
            fileResource.MimeType         = createModel.MimeType;
            fileResource.Public           = createModel.Public;
            fileResource.Size             = createModel.Size;
            fileResource.StorageKey       = createModel.StorageKey;
            fileResource.Tags             = createModel.Tags;
            fileResource.UploadedBy       = uploadedBy;

            var record = await this._fileResourceRepository.save(fileResource);
            return FileResourceMapper.toResponseDto(record);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to create file resource!', error);
        }
    };

    getById = async (id: uuid): Promise<FileResourceResponseDto> => {
        try {
            const record = await this._fileResourceRepository.findOne({
                where : {
                    id : id
                },
                relations : {
                    UploadedBy : true
                },
                select : {
                    id               : true,
                    OriginalFilename : true,
                    CreatedAt        : true,
                    UpdatedAt        : true,
                    DownloadCount    : true,
                    MimeType         : true,
                    Public           : true,
                    Size             : true,
                    StorageKey       : true,
                    Tags             : true,
                    UploadedBy       : {
                        id     : true,
                        Client : {
                            Name : true
                        },
                        FirstName : true,
                        LastName  : true,
                        Prefix    : true
                    },
                },
            });
            return FileResourceMapper.toResponseDto(record);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to retrieve file resource!', error);
        }
    };

    incrementDownloadCount = async (id: uuid): Promise<boolean> => {
        try {
            var record =  await this._fileResourceRepository.findOne({
                where : {
                    id : id
                }
            });
            record.DownloadCount = record.DownloadCount + 1;
            await this._fileResourceRepository.save(record);
            return true;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to update download count for file resource!', error);
        }
    };

    exists = async (id: uuid): Promise<boolean> => {
        try {
            var record =  await this._fileResourceRepository.findOne({
                where : {
                    id : id
                }
            });
            return record !== null;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to determine existance of file resource!', error);
        }
    };

    search = async (filters: FileResourceSearchFilters): Promise<any> => {
        try {

            var search : FindManyOptions<FileResource> = {
                relations : {
                },
                where : {
                },
                select : {
                    id               : true,
                    OriginalFilename : true,
                    CreatedAt        : true,
                    UpdatedAt        : true,
                    DownloadCount    : true,
                    MimeType         : true,
                    Public           : true,
                    Size             : true,
                    StorageKey       : true,
                    Tags             : true,
                    UploadedBy       : {
                        id     : true,
                        Client : {
                            Name : true
                        },
                        FirstName : true,
                        LastName  : true,
                        Prefix    : true
                    },
                }
            };
            if (filters.UserId) {
                search.relations['UploadedBy'] = true;
                search.where['UploadedBy'] = {
                    id : filters.UserId
                };
            }
            if (filters.Filename) {
                search.where['OriginalFilename'] =  Like(`%${filters.Filename}%`);
            }
            if (filters.Tags) {
                search.where['Tags'] =  Like(`%${filters.Tags}%`);
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

            const [list, count] = await this._fileResourceRepository.findAndCount(search);
            const searchResults: FileResourceSearchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => FileResourceMapper.toResponseDto(x)),
            };

            return searchResults;

        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to search file resource records!', error);
        }
    };

    update = async (id: uuid, updateModel) => {
        try {
            if (Object.keys(updateModel).length > 0) {
                var res = await this._fileResourceRepository.update({
                    id : id
                }, updateModel);
                logger.info(`Update SQL Query : ${res.raw}`);
            }
            return await this.getById(id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to update file resource!', error);
        }
    };

    delete = async (id: uuid) => {
        try {
            var record = await this._fileResourceRepository.findOne({
                where : {
                    id : id
                }
            });
            var result = await this._fileResourceRepository.remove(record);
            return result != null;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to delete file resource!', error);
        }
    };

    //#endregion

}
