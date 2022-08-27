import {
    ParticipantModel
} from '../models/participant.model';
import {
    ClientModel
} from '../models/client.model';

import {
    ErrorHandler
} from '../../common/error.handler';
import {
    ParticipantCreateModel,
    ParticipantSearchFilters,
    ParticipantSearchResults
} from '../../domain.types/participant.domain.types';
import {
    Op
} from 'sequelize';

///////////////////////////////////////////////////////////////////////////////////////////////

export class ParticipantService {

    //#region Models

    Participant = ParticipantModel.Model();

    Client = ClientModel.Model();


    //#endregion

    //#region Publics

    create = async (createModel: ParticipantCreateModel) => {
        try {
            var record = await this.Participant.create(createModel);
            return await this.getById(record.id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to create participant!', error);
        }
    }

    getById = async (id) => {
        try {
            const record = await this.Participant.findOne({
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
            ErrorHandler.throwDbAccessError('DB Error: Unable to retrieve participant!', error);
        }
    }

    exists = async (id): Promise < boolean > => {
        try {
            const record = await this.Participant.findByPk(id);
            return record !== null;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to determine existance of participant!', error);
        }
    }

    search = async (filters: ParticipantSearchFilters): Promise < ParticipantSearchResults > => {
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

            const foundResults = await this.Participant.findAndCountAll(search);
            const searchResults: ParticipantSearchResults = {
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
            ErrorHandler.throwDbAccessError('DB Error: Unable to search participant records!', error);
        }
    }

    update = async (id, updateModel) => {
        try {
            if (Object.keys(updateModel).length > 0) {
                var res = await this.Participant.update(updateModel, {
                    where: {
                        id: id
                    }
                });
                if (res.length !== 1) {
                    throw new Error('Unable to update participant!');
                }
            }
            return await this.getById(id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to update participant!', error);
        }
    }

    delete = async (id) => {
        try {
            var result = await this.Participant.destroy({
                where: {
                    id: id
                }
            });
            return result === 1;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to delete participant!', error);
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
        if (filters.FirstName) {
            search.where['FirstName'] = filters.FirstName
        }
        if (filters.LastName) {
            search.where['LastName'] = filters.LastName
        }
        if (filters.Gender) {
            search.where['Gender'] = filters.Gender
        }
        if (filters.BirthDate) {
            search.where['BirthDate'] = filters.BirthDate
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