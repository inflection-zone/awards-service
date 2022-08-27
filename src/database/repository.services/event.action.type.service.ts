import {
    EventActionTypeModel
} from '../models/event.action.type.model';
import {
    SchemeModel
} from '../models/scheme.model';
import {
    EventModel
} from '../models/event.model';
import {
    ClientModel
} from '../models/client.model';
import {
    RuleNodeModel
} from '../models/rule.node.model';

import {
    ErrorHandler
} from '../../common/error.handler';
import {
    EventActionTypeCreateModel,
    EventActionTypeSearchFilters,
    EventActionTypeSearchResults
} from '../../domain.types/event.action.type.domain.types';
import {
    Op
} from 'sequelize';

///////////////////////////////////////////////////////////////////////////////////////////////

export class EventActionTypeService {

    //#region Models

    EventActionType = EventActionTypeModel.Model();

    Scheme = SchemeModel.Model();

    Event = EventModel.Model();

    Client = ClientModel.Model();

    RuleNode = RuleNodeModel.Model();


    //#endregion

    //#region Publics

    create = async (createModel: EventActionTypeCreateModel) => {
        try {
            var record = await this.EventActionType.create(createModel);
            return await this.getById(record.id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to create event action type!', error);
        }
    }

    getById = async (id) => {
        try {
            const record = await this.EventActionType.findOne({
                where: {
                    id: id
                },
                include: [{
                        model: this.Scheme,
                        required: false,
                        as: 'Scheme',
                        //through: { attributes: [] }
                    }, {
                        model: this.Event,
                        required: false,
                        as: 'Event',
                        //through: { attributes: [] }
                    }, {
                        model: this.Client,
                        required: false,
                        as: 'Client',
                        //through: { attributes: [] }
                    }, {
                        model: this.RuleNode,
                        required: false,
                        as: 'RootRuleNode',
                        //through: { attributes: [] }
                    },

                ]
            });
            return record;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to retrieve event action type!', error);
        }
    }

    exists = async (id): Promise < boolean > => {
        try {
            const record = await this.EventActionType.findByPk(id);
            return record !== null;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to determine existance of event action type!', error);
        }
    }

    search = async (filters: EventActionTypeSearchFilters): Promise < EventActionTypeSearchResults > => {
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

            const foundResults = await this.EventActionType.findAndCountAll(search);
            const searchResults: EventActionTypeSearchResults = {
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
            ErrorHandler.throwDbAccessError('DB Error: Unable to search event action type records!', error);
        }
    }

    update = async (id, updateModel) => {
        try {
            if (Object.keys(updateModel).length > 0) {
                var res = await this.EventActionType.update(updateModel, {
                    where: {
                        id: id
                    }
                });
                if (res.length !== 1) {
                    throw new Error('Unable to update event action type!');
                }
            }
            return await this.getById(id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to update event action type!', error);
        }
    }

    delete = async (id) => {
        try {
            var result = await this.EventActionType.destroy({
                where: {
                    id: id
                }
            });
            return result === 1;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to delete event action type!', error);
        }
    }

    //#endregion

    //#region Privates

    private getSearchModel = (filters) => {

        var search = {
            where: {},
            include: []
        };

        if (filters.SchemeId) {
            search.where['SchemeId'] = filters.SchemeId
        }
        if (filters.EventId) {
            search.where['EventId'] = filters.EventId
        }
        if (filters.ClientId) {
            search.where['ClientId'] = filters.ClientId
        }
        if (filters.Name) {
            search.where['Name'] = {
                [Op.like]: '%' + filters.Name + '%'
            }
        }
        if (filters.RootRuleNodeId) {
            search.where['RootRuleNodeId'] = filters.RootRuleNodeId
        }
        const includeSchemeAsScheme = {
            model: this.Scheme,
            required: false,
            as: 'Scheme',
            where: {}
        }
        //if (filters.Xyz != undefined) {
        //    includeScheme.where['Xyz'] = filters.Xyz;
        //}
        search.include.push(includeSchemeAsScheme);
        const includeEventAsEvent = {
            model: this.Event,
            required: false,
            as: 'Event',
            where: {}
        }
        //if (filters.Xyz != undefined) {
        //    includeEvent.where['Xyz'] = filters.Xyz;
        //}
        search.include.push(includeEventAsEvent);
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
        const includeRuleNodeAsRootRuleNode = {
            model: this.RuleNode,
            required: false,
            as: 'RootRuleNode',
            where: {}
        }
        //if (filters.Xyz != undefined) {
        //    includeRuleNode.where['Xyz'] = filters.Xyz;
        //}
        search.include.push(includeRuleNodeAsRootRuleNode);


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