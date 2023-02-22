import { FileResource } from '../../models/general/file.resource.model';
import { User } from '../../models/user/user.model';
import { ErrorHandler } from '../../../common/error.handler';
import { FileResourceCreateModel, FileResourceResponseDto } from '../../../domain.types/file.resource.domain.types';
import Source from '../../../database/database.connector';
import { Repository } from 'typeorm';
import { FileResourceMapper } from '../../mappers/general/file.resource.mapper';
import { uuid } from '../../domain.types/miscellaneous/system.types';

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

    getById = async (id) => {
        try {
            const record = await this._fileResourceRepository.findOne({
                where : {
                    id : id
                },
                relations : {
                    UploadedBy : true
                },
                include : [{
                    model    : this.User,
                    required : false,
                    as       : 'User',
                    //through: { attributes: [] }
                },

                ]
            });
            return record;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to retrieve file resource!', error);
        }
    };

    incrementDownloadCount = async (id: uuid) => {
        try {
            var record =  await this._fileResourceRepository.findOne({
                where : {
                    id : id
                }
            });

            record.DownloadCount = record.DownloadCount + 1;
            await record.save();
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to update download count for file resource!', error);
        }
    };

    exists = async (id): Promise<boolean> => {
        try {
            const record = await this.FileResource.findByPk(id);
            return record !== null;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to determine existance of file resource!', error);
        }
    };

    search = async (filters): Promise<any> => {
        try {

            var search = this.getSearchModel(filters);
            var {
                order,
                orderByColumn
            } = this.addSortingToSearch(search, filters);
            var {
                pageIndex,
                limit
            } = this.addPaginationToSearch(search, filters);

            const foundResults = await this.FileResource.findAndCountAll(search);
            const searchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : foundResults.rows.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : foundResults.rows,
            };

            return searchResults;

        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to search file resource records!', error);
        }
    };

    update = async (id, updateModel) => {
        try {
            if (Object.keys(updateModel).length > 0) {
                var res = await this.FileResource.update(updateModel, {
                    where : {
                        id : id
                    }
                });
                if (res.length !== 1) {
                    throw new Error('Unable to update file resource!');
                }
            }
            return await this.getById(id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to update file resource!', error);
        }
    };

    delete = async (id) => {
        try {
            var result = await this.FileResource.destroy({
                where : {
                    id : id
                }
            });
            return result === 1;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to delete file resource!', error);
        }
    };

    //#endregion

    //#region Privates

    private getSearchModel = (filters) => {

        var search = {
            where   : {},
            include : []
        };

        if (filters.FileName) {
            search.where['FileName'] = {
                [Op.like] : '%' + filters.FileName + '%'
            };
        }
        if (filters.IsPublicResource) {
            search.where['IsPublicResource'] = filters.IsPublicResource;
        }
        if (filters.Tags) {
            search.where['Tags'] = {
                [Op.like] : '%' + filters.Tags + '%'
            };
        }
        if (filters.MimeType) {
            search.where['MimeType'] = {
                [Op.like] : '%' + filters.MimeType + '%'
            };
        }
        const includeUserAsUser = {
            model    : this.User,
            required : false,
            as       : 'User',
            where    : {}
        };
        //if (filters.Xyz != undefined) {
        //    includeUser.where['Xyz'] = filters.Xyz;
        //}
        search.include.push(includeUserAsUser);

        return search;
    };

    private addSortingToSearch = (search, filters) => {

        let orderByColumn = 'CreatedAt';
        if (filters.OrderBy) {
            orderByColumn = filters.OrderBy;
        }
        let order = 'ASC';
        if (filters.Order === 'descending') {
            order = 'DESC';
        }
        search['order'] = [
            [orderByColumn, order]
        ];

        if (filters.OrderBy) {
            //In case the 'order-by attribute' is on associated model
            //search['order'] = [[ '<AssociatedModel>', filters.OrderBy, order]];
        }
        return {
            order,
            orderByColumn
        };
    };

    private addPaginationToSearch = (search, filters) => {

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
        search['limit'] = limit;
        search['offset'] = offset;

        return {
            pageIndex,
            limit
        };
    };

    //#endregion

}
