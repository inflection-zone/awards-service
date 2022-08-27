import {
    RedemptionModel
} from '../models/redemption.model';
import {
    ClientModel
} from '../models/client.model';
import {
    SchemeModel
} from '../models/scheme.model';
import {
    ParticipantModel
} from '../models/participant.model';
import {
    RuleNodeModel
} from '../models/rule.node.model';

import {
    ErrorHandler
} from '../../common/error.handler';
import {
    RedemptionCreateModel,
    RedemptionSearchFilters,
    RedemptionSearchResults
} from '../../domain.types/redemption.domain.types';
import {
    Op
} from 'sequelize';

///////////////////////////////////////////////////////////////////////////////////////////////

export class RedemptionService {

    //#region Models

    Redemption = RedemptionModel.Model();

    Client = ClientModel.Model();

    Scheme = SchemeModel.Model();

    Participant = ParticipantModel.Model();

    RuleNode = RuleNodeModel.Model();


    //#endregion

    //#region Publics

    create = async (createModel: RedemptionCreateModel) => {
        try {
            var record = await this.Redemption.create(createModel);
            return await this.getById(record.id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to create redemption!', error);
        }
    }

    getById = async (id) => {
        try {
            const record = await this.Redemption.findOne({
                where: {
                    id: id
                },
                include: [{
                        model: this.Client,
                        required: false,
                        as: 'Client',
                        //through: { attributes: [] }
                    }, {
                        model: this.Scheme,
                        required: false,
                        as: 'Scheme',
                        //through: { attributes: [] }
                    }, {
                        model: this.Participant,
                        required: false,
                        as: 'Participant',
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
            ErrorHandler.throwDbAccessError('DB Error: Unable to retrieve redemption!', error);
        }
    }

    exists = async (id): Promise < boolean > => {
        try {
            const record = await this.Redemption.findByPk(id);
            return record !== null;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to determine existance of redemption!', error);
        }
    }

    search = async (filters: RedemptionSearchFilters): Promise < RedemptionSearchResults > => {
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

            const foundResults = await this.Redemption.findAndCountAll(search);
            const searchResults: RedemptionSearchResults = {
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
            ErrorHandler.throwDbAccessError('DB Error: Unable to search redemption records!', error);
        }
    }

    update = async (id, updateModel) => {
        try {
            if (Object.keys(updateModel).length > 0) {
                var res = await this.Redemption.update(updateModel, {
                    where: {
                        id: id
                    }
                });
                if (res.length !== 1) {
                    throw new Error('Unable to update redemption!');
                }
            }
            return await this.getById(id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to update redemption!', error);
        }
    }

    delete = async (id) => {
        try {
            var result = await this.Redemption.destroy({
                where: {
                    id: id
                }
            });
            return result === 1;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to delete redemption!', error);
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
        if (filters.SchemeId) {
            search.where['SchemeId'] = filters.SchemeId
        }
        if (filters.ParticipantId) {
            search.where['ParticipantId'] = filters.ParticipantId
        }
        if (filters.Name) {
            search.where['Name'] = {
                [Op.like]: '%' + filters.Name + '%'
            }
        }
        if (filters.RedemptionDate) {
            search.where['RedemptionDate'] = filters.RedemptionDate
        }
        if (filters.RedemptionStatus) {
            search.where['RedemptionStatus'] = filters.RedemptionStatus
        }
        if (filters.RootRuleNodeId) {
            search.where['RootRuleNodeId'] = filters.RootRuleNodeId
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