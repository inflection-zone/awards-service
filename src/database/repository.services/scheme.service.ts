import {
    SchemeModel
} from '../models/workflow/scheme.model';
import {
    ClientModel
} from '../models/client.model';

import {
    ErrorHandler
} from '../../common/error.handler';
import {
    SchemeCreateModel,
    SchemeSearchFilters,
    SchemeSearchResults
} from '../../domain.types/scheme.domain.types';
import {
    Op
} from 'sequelize';

///////////////////////////////////////////////////////////////////////////////////////////////

export class SchemeService {

    //#region Models

    Scheme = SchemeModel.Model();

    Client = ClientModel.Model();


    //#endregion

    //#region Publics

    create = async (createModel: SchemeCreateModel) => {
        try {
            var record = await this.Scheme.create(createModel);
            return await this.getById(record.id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to create scheme!', error);
        }
    }

    getById = async (id) => {
        try {
            const record = await this.Scheme.findOne({
                where: {
                    id: id
                },
                include: [{
                        model: this.Client,
                        required: false,
                        as: 'Client',
                        //through: { attributes: [] }
                    },

                ]
            });
            return record;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to retrieve scheme!', error);
        }
    }

    exists = async (id): Promise < boolean > => {
        try {
            const record = await this.Scheme.findByPk(id);
            return record !== null;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to determine existance of scheme!', error);
        }
    }

    search = async (filters: SchemeSearchFilters): Promise < SchemeSearchResults > => {
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

            const foundResults = await this.Scheme.findAndCountAll(search);
            const searchResults: SchemeSearchResults = {
                TotalCount: foundResults.count,
                RetrievedCount: foundResults.rows.length,
                PageIndex: pageIndex,
                ItemsPerPage: limit,
                Order: order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy: orderByColumn,
                Items: foundResults.rows,
            };

            return searchResults;

        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to search scheme records!', error);
        }
    }

    update = async (id, updateModel) => {
        try {
            if (Object.keys(updateModel).length > 0) {
                var res = await this.Scheme.update(updateModel, {
                    where: {
                        id: id
                    }
                });
                if (res.length !== 1) {
                    throw new Error('Unable to update scheme!');
                }
            }
            return await this.getById(id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to update scheme!', error);
        }
    }

    delete = async (id) => {
        try {
            var result = await this.Scheme.destroy({
                where: {
                    id: id
                }
            });
            return result === 1;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to delete scheme!', error);
        }
    }

    //#endregion

    //#region Privates

    private getSearchModel = (filters) => {

        var search = {
            where: {},
            include: []
        };

        if (filters.ClientId) {
            search.where['ClientId'] = filters.ClientId
        }
        if (filters.Name) {
            search.where['Name'] = {
                [Op.like]: '%' + filters.Name + '%'
            }
        }
        if (filters.ValidFrom) {
            search.where['ValidFrom'] = filters.ValidFrom
        }
        if (filters.ValidTill) {
            search.where['ValidTill'] = filters.ValidTill
        }
        const includeClientAsClient = {
            model: this.Client,
            required: false,
            as: 'Client',
            where: {}
        }
        //if (filters.Xyz != undefined) {
        //    includeClient.where['Xyz'] = filters.Xyz;
        //}
        search.include.push(includeClientAsClient);


        return search;
    }

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
    }

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
    }

    //#endregion

}