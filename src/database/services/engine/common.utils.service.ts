import { Node } from '../../models/engine/node.model';
import { Schema } from '../../models/engine/schema.model';
import { Rule } from '../../models/engine/rule.model';
import { NodeDefaultAction } from '../../models/engine/node.default.action.model';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../database.connector';
import { Repository } from 'typeorm';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////

export class CommonUtilsService {

    //#region Repositories

    _nodeRepository: Repository<Node> = Source.getRepository(Node);

    _schemaRepository: Repository<Schema> = Source.getRepository(Schema);

    _ruleRepository: Repository<Rule> = Source.getRepository(Rule);

    _actionRepository: Repository<NodeDefaultAction> = Source.getRepository(NodeDefaultAction);

    //#endregion
    
    public getSchema = async (schemaId: uuid) => {
        const schema = await this._schemaRepository.findOne({
            where : {
                id: schemaId as string
            }
        });
        if (!schema) {
            ErrorHandler.throwNotFoundError('Schema cannot be found');
        }
        return schema;
    }

    public createAction = async (actionModel: any) => {
        const action = await this._actionRepository.create({
            ActionType   : actionModel.ActionType,
            ActionSubject: actionModel.ActionSubject,
            Name         : actionModel.Name,
            Description  : actionModel.Description,
            Params       : actionModel.Params
        });
        return action;
    }

}