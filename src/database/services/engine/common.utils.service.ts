import { Node } from '../../models/engine/node.model';
import { Schema } from '../../models/engine/schema.model';
import { Rule } from '../../models/engine/rule.model';
import { Client } from '../../../database/models/client/client.model';
import { NodeDefaultAction } from '../../models/engine/node.default.action.model';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../database.connector';
import { Repository } from 'typeorm';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { Context } from '../../../database/models/engine/context.model';

///////////////////////////////////////////////////////////////////////

export class CommonUtilsService {

    //#region Repositories

    _nodeRepository: Repository<Node> = Source.getRepository(Node);

    _schemaRepository: Repository<Schema> = Source.getRepository(Schema);

    _ruleRepository: Repository<Rule> = Source.getRepository(Rule);

    _contextRepository: Repository<Context> = Source.getRepository(Context);

    _actionRepository: Repository<NodeDefaultAction> = Source.getRepository(NodeDefaultAction);

    _clientRepository: Repository<Client> = Source.getRepository(Client);

    //#endregion
    
    public getSchema = async (schemaId: uuid) => {
        const schema = await this._schemaRepository.findOne({
            where : {
                id: schemaId as string
            },
            relations: {
                Client : true,
                Nodes  : true,
            }
        });
        if (!schema) {
            ErrorHandler.throwNotFoundError('Schema cannot be found');
        }
        return schema;
    }

    public createAction = async (actionModel: any) => {
        const action = await this._actionRepository.create({
            ActionType  : actionModel.ActionType,
            Name        : actionModel.Name,
            Description : actionModel.Description,
            InputParams : actionModel.InputParams,
            OutputParams: actionModel.OutputParams
        });
        return action;
    }

    public getNode = async (nodeId: uuid) => {
        return await this._nodeRepository.findOne({
            where: {
                id: nodeId
            },
            relations: {
                Action: true,
                Children: true,
                ParentNode: true,
                Rules: true,
                Schema: true,
            }
        });
    };

    public getClient = async (clientId: uuid) => {
        const client = await this._clientRepository.findOne({
            where : {
                id : clientId
            }
        });
        if (!client) {
            ErrorHandler.throwNotFoundError('Client cannot be found');
        }
        return client;
    };

    
    public getContext = async (contextId: uuid) => {
        const context = await this._contextRepository.findOne({
            where : {
                id : contextId
            },
            relations: {
                Participant: true,
                Group: true,
            }
        });
        if (!context) {
            ErrorHandler.throwNotFoundError('Context cannot be found');
        }
        return context;
    };

}