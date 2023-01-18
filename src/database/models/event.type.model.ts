import DatabaseConnector from '../database.connector';
const sequelize = DatabaseConnector.sequelize;
import { DataTypes } from 'sequelize';

////////////////////////////////////////////////////////////////////////

export class EventTypeModel {

    static TableName = 'event_types';

    static ModelName = 'EventType';

    static Schema = {
        id : {
            type         : DataTypes.UUID,
            allowNull    : false,
            defaultValue : DataTypes.UUIDV4,
            primaryKey   : true
        },
        SchemeId : {
            type       : DataTypes.UUID,
            allowNull  : false,
            foreignKey : true,
            unique     : false
        },
        ClientId : {
            type       : DataTypes.UUID,
            allowNull  : false,
            foreignKey : true,
            unique     : false
        },
        Name : {
            type      : DataTypes.STRING(256),
            allowNull : false
        },
        Description : {
            type      : DataTypes.STRING(512),
            allowNull : true
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
        EventTypeModel.ModelName,
        EventTypeModel.Schema, {
            createdAt       : 'CreatedAt',
            updatedAt       : 'UpdatedAt',
            deletedAt       : 'DeletedAt',
            freezeTableName : true,
            timestamps      : true,
            paranoid        : true,
            tableName       : EventTypeModel.TableName,
        });

    static associate = (models) => {

        //Add associations here...

        models.EventType.belongsTo(models.Scheme, {
            sourceKey : 'SchemeId',
            targetKey : 'id',
            as        : 'Scheme'
        });

        models.EventType.belongsTo(models.Client, {
            sourceKey : 'ClientId',
            targetKey : 'id',
            as        : 'Client'
        });

        models.EventType.belongsTo(models.RuleNode, {
            sourceKey : 'RootRuleNodeId',
            targetKey : 'id',
            as        : 'RootRuleNode'
        });

    };

}
