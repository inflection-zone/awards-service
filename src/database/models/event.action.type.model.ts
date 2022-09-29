import DatabaseConnector from '../database.connector';

////////////////////////////////////////////////////////////////////////

export class EventActionTypeModel {

    static TableName = 'event_action_types';

    static ModelName = 'EventActionType';

    static Schema = () => {

        const db = DatabaseConnector;
        const Sequelize: any = db.Sequelize;

        return {
            id : {
                type         : Sequelize.UUID,
                allowNull    : false,
                defaultValue : Sequelize.UUIDV4,
                primaryKey   : true
            },
            SchemeId : {
                type       : Sequelize.UUID,
                allowNull  : false,
                foreignKey : true,
                unique     : false
            },
            EventId : {
                type       : Sequelize.UUID,
                allowNull  : false,
                foreignKey : true,
                unique     : false
            },
            ClientId : {
                type       : Sequelize.UUID,
                allowNull  : false,
                foreignKey : true,
                unique     : false
            },
            Name : {
                type      : Sequelize.STRING(256),
                allowNull : false
            },
            RootRuleNodeId : {
                type       : Sequelize.UUID,
                allowNull  : false,
                foreignKey : true,
                unique     : false
            },

            CreatedAt : Sequelize.DATE,
            UpdatedAt : Sequelize.DATE,
            DeletedAt : Sequelize.DATE
        };
    }

    static Model: any = () => {

        const db = DatabaseConnector;
        const sequelize = db.sequelize;
        const schema = EventActionTypeModel.Schema();

        return sequelize.define(
            EventActionTypeModel.ModelName,
            schema, {
                createdAt       : 'CreatedAt',
                updatedAt       : 'UpdatedAt',
                deletedAt       : 'DeletedAt',
                freezeTableName : true,
                timestamps      : true,
                paranoid        : true,
                tableName       : EventActionTypeModel.TableName,
            });
    };

    static associate = (models) => {

        //Add associations here...

        models.EventActionType.belongsTo(models.Scheme, {
            sourceKey : 'SchemeId',
            targetKey : 'id',
            as        : 'Scheme'
        });

        models.EventActionType.belongsTo(models.Event, {
            sourceKey : 'EventId',
            targetKey : 'id',
            as        : 'Event'
        });

        models.EventActionType.belongsTo(models.Client, {
            sourceKey : 'ClientId',
            targetKey : 'id',
            as        : 'Client'
        });

        models.EventActionType.belongsTo(models.RuleNode, {
            sourceKey : 'RootRuleNodeId',
            targetKey : 'id',
            as        : 'RootRuleNode'
        });

    };

}
