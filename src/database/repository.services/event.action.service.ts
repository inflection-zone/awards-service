import {
    EventActionModel
} from '../models/event.action.model';
import {
    EventActionTypeModel
} from '../models/event.action.type.model';
import {
    ParticipantModel
} from '../models/participant.model';
import {
    SchemeModel
} from '../models/scheme.model';
import {
    RuleNodeModel
} from '../models/rule.node.model';

import {
    ErrorHandler
} from '../../common/error.handler';
import {
    EventActionCreateModel,
    EventActionSearchFilters,
    EventActionSearchResults
} from '../../domain.types/event.action.domain.types';
import {
    Op
} from 'sequelize';

///////////////////////////////////////////////////////////////////////////////////////////////

export class EventActionService {

    //#region Models

    EventAction = EventActionModel.Model();

    EventActionType = EventActionTypeModel.Model();

    Participant = ParticipantModel.Model();

    Scheme = SchemeModel.Model();

    //#endregion

    //#region Publics

    create = async (createModel: EventActionCreateModel) => {
        try {
            var record = await this.EventAction.create(createModel);
            return await this.getById(record.id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to create event action!', error);
        }
    }

    getById = async (id) => {
        try {
            const record = await this.EventAction.findOne({
                where : {
                    id : id
                },
                include : [{
                    model    : this.EventActionType,
                    required : false,
                    as       : 'EventActionType',
                    //through: { attributes: [] }
                }, {
                    model    : this.Participant,
                    required : false,
                    as       : 'Participant',
                    //through: { attributes: [] }
                }, {
                    model    : this.Scheme,
                    required : false,
                    as       : 'Scheme',
                    //through: { attributes: [] }
                }, {
                    //model: this.RuleNode,
                    required : false,
                    as       : 'RootRuleNode',
                    //through: { attributes: [] }
                },

                ]
            });
            return record;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to retrieve event action!', error);
        }
    }

    exists = async (id): Promise < boolean > => {
        try {
            const record = await this.EventAction.findByPk(id);
            return record !== null;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to determine existance of event action!', error);
        }
    }

    search = async (filters: EventActionSearchFilters): Promise < EventActionSearchResults > => {
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

            const foundResults = await this.EventAction.findAndCountAll(search);
            const searchResults: EventActionSearchResults = {
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
            ErrorHandler.throwDbAccessError('DB Error: Unable to search event action records!', error);
        }
    }

    update = async (id, updateModel) => {
        try {
            if (Object.keys(updateModel).length > 0) {
                var res = await this.EventAction.update(updateModel, {
                    where : {
                        id : id
                    }
                });
                if (res.length !== 1) {
                    throw new Error('Unable to update event action!');
                }
            }
            return await this.getById(id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to update event action!', error);
        }
    }

    delete = async (id) => {
        try {
            var result = await this.EventAction.destroy({
                where : {
                    id : id
                }
            });
            return result === 1;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to delete event action!', error);
        }
    }

    //#endregion

    //#region Privates

    private getSearchModel = (filters) => {

        var search = {
            where   : {},
            include : []
        };

        if (filters.EventActionTypeId) {
            search.where['EventActionTypeId'] = filters.EventActionTypeId;
        }
        if (filters.ParticipantId) {
            search.where['ParticipantId'] = filters.ParticipantId;
        }
        if (filters.SchemeId) {
            search.where['SchemeId'] = filters.SchemeId;
        }
        if (filters.Timestamp) {
            search.where['Timestamp'] = filters.Timestamp;
        }
        if (filters.RootRuleNodeId) {
            search.where['RootRuleNodeId'] = filters.RootRuleNodeId;
        }
        const includeEventActionTypeAsEventActionType = {
            model    : this.EventActionType,
            required : false,
            as       : 'EventActionType',
            where    : {}
        };
        //if (filters.Xyz != undefined) {
        //    includeEventActionType.where['Xyz'] = filters.Xyz;
        //}
        search.include.push(includeEventActionTypeAsEventActionType);
        const includeParticipantAsParticipant = {
            model    : this.Participant,
            required : false,
            as       : 'Participant',
            where    : {}
        };
        //if (filters.Xyz != undefined) {
        //    includeParticipant.where['Xyz'] = filters.Xyz;
        //}
        search.include.push(includeParticipantAsParticipant);
        const includeSchemeAsScheme = {
            model    : this.Scheme,
            required : false,
            as       : 'Scheme',
            where    : {}
        };
        //if (filters.Xyz != undefined) {
        //    includeScheme.where['Xyz'] = filters.Xyz;
        //}
        search.include.push(includeSchemeAsScheme);
        const includeRuleNodeAsRootRuleNode = {
            //model    : this.RuleNode,
            required : false,
            as       : 'RootRuleNode',
            where    : {}
        };
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
