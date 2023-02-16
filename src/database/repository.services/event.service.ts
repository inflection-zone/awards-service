import {
    EventModel
} from '../models/workflow/event.model';
import {
    EventTypeModel
} from '../models/workflow/event.type.model';
import {
    ParticipantModel
} from '../models/awards/participant.model';
import {
    SchemeModel
} from '../models/workflow/scheme.model';
import {
    RuleNodeModel
} from '../models/workflow/rule.node.model';

import {
    ErrorHandler
} from '../../common/error.handler';
import {
    EventCreateModel,
    EventSearchFilters,
    EventSearchResults
} from '../../domain.types/event.domain.types';
import {
    Op
} from 'sequelize';

///////////////////////////////////////////////////////////////////////////////////////////////

export class EventService {

    //#region Models

    Event = EventModel.Model();

    EventType = EventTypeModel.Model();

    Participant = ParticipantModel.Model();

    Scheme = SchemeModel.Model();

    RuleNode = RuleNodeModel.Model();


    //#endregion

    //#region Publics

    create = async (createModel: EventCreateModel) => {
        try {
            var record = await this.Event.create(createModel);
            return await this.getById(record.id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to create event!', error);
        }
    }

    getById = async (id) => {
        try {
            const record = await this.Event.findOne({
                where: {
                    id: id
                },
                include: [{
                        model: this.EventType,
                        required: false,
                        as: 'EventType',
                        //through: { attributes: [] }
                    }, {
                        model: this.Participant,
                        required: false,
                        as: 'Participant',
                        //through: { attributes: [] }
                    }, {
                        model: this.Scheme,
                        required: false,
                        as: 'Scheme',
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
            ErrorHandler.throwDbAccessError('DB Error: Unable to retrieve event!', error);
        }
    }

    exists = async (id): Promise < boolean > => {
        try {
            const record = await this.Event.findByPk(id);
            return record !== null;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to determine existance of event!', error);
        }
    }

    search = async (filters: EventSearchFilters): Promise < EventSearchResults > => {
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

            const foundResults = await this.Event.findAndCountAll(search);
            const searchResults: EventSearchResults = {
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
            ErrorHandler.throwDbAccessError('DB Error: Unable to search event records!', error);
        }
    }

    update = async (id, updateModel) => {
        try {
            if (Object.keys(updateModel).length > 0) {
                var res = await this.Event.update(updateModel, {
                    where: {
                        id: id
                    }
                });
                if (res.length !== 1) {
                    throw new Error('Unable to update event!');
                }
            }
            return await this.getById(id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to update event!', error);
        }
    }

    delete = async (id) => {
        try {
            var result = await this.Event.destroy({
                where: {
                    id: id
                }
            });
            return result === 1;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to delete event!', error);
        }
    }

    //#endregion

    //#region Privates

    private getSearchModel = (filters) => {

        var search = {
            where: {},
            include: []
        };

        if (filters.EventTypeId) {
            search.where['EventTypeId'] = filters.EventTypeId
        }
        if (filters.ParticipantId) {
            search.where['ParticipantId'] = filters.ParticipantId
        }
        if (filters.SchemeId) {
            search.where['SchemeId'] = filters.SchemeId
        }
        if (filters.Timestamp) {
            search.where['Timestamp'] = filters.Timestamp
        }
        if (filters.RootRuleNodeId) {
            search.where['RootRuleNodeId'] = filters.RootRuleNodeId
        }
        const includeEventTypeAsEventType = {
            model: this.EventType,
            required: false,
            as: 'EventType',
            where: {}
        }
        //if (filters.Xyz != undefined) {
        //    includeEventType.where['Xyz'] = filters.Xyz;
        //}
        search.include.push(includeEventTypeAsEventType);
        const includeParticipantAsParticipant = {
            model: this.Participant,
            required: false,
            as: 'Participant',
            where: {}
        }
        //if (filters.Xyz != undefined) {
        //    includeParticipant.where['Xyz'] = filters.Xyz;
        //}
        search.include.push(includeParticipantAsParticipant);
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