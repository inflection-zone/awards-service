import DatabaseConnector from '../database.connector';
const sequelize = DatabaseConnector.sequelize;
import { DataTypes } from 'sequelize';

////////////////////////////////////////////////////////////////////////

export class EventActionModel {

    static TableName = 'event_actions';

    static ModelName = 'EventAction';

    static Schema = {
        id : {
            type         : DataTypes.UUID,
            allowNull    : false,
            defaultValue : DataTypes.UUIDV4,
            primaryKey   : true
        },
        EventActionTypeId : {
            type       : DataTypes.UUID,
            allowNull  : false,
            foreignKey : true,
            unique     : false
        },
        ParticipantId : {
            type       : DataTypes.UUID,
            allowNull  : false,
            foreignKey : true,
            unique     : false
        },
        SchemeId : {
            type       : DataTypes.UUID,
            allowNull  : false,
            foreignKey : true,
            unique     : false
        },
        Timestamp : {
            type      : DataTypes.DATE,
            allowNull : false
        },
        RootRuleNodeId : {
            type       : DataTypes.UUID,
            allowNull  : false,
            foreignKey : true,
            unique     : false
        },

        CreatedAt : DataTypes.DATE,
        UpdatedAt : DataTypes.DATE,
        DeletedAt : DataTypes.DATE
    };

    static Model: any = sequelize.define(
        EventActionModel.ModelName,
        EventActionModel.Schema,
        {
            createdAt       : 'CreatedAt',
            updatedAt       : 'UpdatedAt',
            deletedAt       : 'DeletedAt',
            freezeTableName : true,
            timestamps      : true,
            paranoid        : true,
            tableName       : EventActionModel.TableName,
        });

    static associate = (models) => {

        //Add associations here...

        models.EventAction.belongsTo(models.EventActionType, {
            sourceKey : 'EventActionTypeId',
            targetKey : 'id',
            as        : 'EventActionType'
        });

        models.EventAction.belongsTo(models.Participant, {
            sourceKey : 'ParticipantId',
            targetKey : 'id',
            as        : 'Participant'
        });

        models.EventAction.belongsTo(models.Scheme, {
            sourceKey : 'SchemeId',
            targetKey : 'id',
            as        : 'Scheme'
        });

        models.EventAction.belongsTo(models.RuleNode, {
            sourceKey : 'RootRuleNodeId',
            targetKey : 'id',
            as        : 'RootRuleNode'
        });

    };

}
