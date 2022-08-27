import {
    RuleNodeOperationTypeModel
} from '../models/rule.node.operation.type.model';

import {
    ErrorHandler
} from '../../common/error.handler';
import {
    RuleNodeOperationTypeCreateModel,
    RuleNodeOperationTypeSearchFilters,
    RuleNodeOperationTypeSearchResults
} from '../../domain.types/rule.node.operation.type.domain.types';
import {
    Op
} from 'sequelize';

///////////////////////////////////////////////////////////////////////////////////////////////

export class RuleNodeOperationTypeService {

    //#region Models

    RuleNodeOperationType = RuleNodeOperationTypeModel.Model();


    //#endregion

    //#region Publics

    create = async (createModel: RuleNodeOperationTypeCreateModel) => {
        try {
            var record = await this.RuleNodeOperationType.create(createModel);
            return await this.getById(record.id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to create rule node operation type!', error);
        }
    }

    getById = async (id) => {
        try {
            const record = await this.RuleNodeOperationType.findOne({
                where: {
                    id: id
                },
                include: [

                ]
            });
            return record;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to retrieve rule node operation type!', error);
        }
    }

    exists = async (id): Promise < boolean > => {
        try {
            const record = await this.RuleNodeOperationType.findByPk(id);
            return record !== null;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to determine existance of rule node operation type!', error);
        }
    }

    search = async (filters: RuleNodeOperationTypeSearchFilters): Promise < RuleNodeOperationTypeSearchResults > => {
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

            const foundResults = await this.RuleNodeOperationType.findAndCountAll(search);
            const searchResults: RuleNodeOperationTypeSearchResults = {
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
            ErrorHandler.throwDbAccessError('DB Error: Unable to search rule node operation type records!', error);
        }
    }

    update = async (id, updateModel) => {
        try {
            if (Object.keys(updateModel).length > 0) {
                var res = await this.RuleNodeOperationType.update(updateModel, {
                    where: {
                        id: id
                    }
                });
                if (res.length !== 1) {
                    throw new Error('Unable to update rule node operation type!');
                }
            }
            return await this.getById(id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to update rule node operation type!', error);
        }
    }

    delete = async (id) => {
        try {
            var result = await this.RuleNodeOperationType.destroy({
                where: {
                    id: id
                }
            });
            return result === 1;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to delete rule node operation type!', error);
        }
    }

    //#endregion

    //#region Privates

    private getSearchModel = (filters) => {

        var search = {
            where: {},
            include: []
        };

        if (filters.Composition) {
            search.where['Composition'] = filters.Composition
        }
        if (filters.Logical) {
            search.where['Logical'] = filters.Logical
        }
        if (filters.Mathematical) {
            search.where['Mathematical'] = filters.Mathematical
        }


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