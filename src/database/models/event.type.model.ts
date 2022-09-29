import DatabaseConnector from '../database.connector';

////////////////////////////////////////////////////////////////////////

export class EventTypeModel {

    static TableName = 'event_types';

    static ModelName = 'EventType';

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
            Description : {
                type      : Sequelize.STRING(512),
                allowNull : true
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
        const schema = EventTypeModel.Schema();

        return sequelize.define(
            EventTypeModel.ModelName,
            schema, {
                createdAt       : 'CreatedAt',
                updatedAt       : 'UpdatedAt',
                deletedAt       : 'DeletedAt',
                freezeTableName : true,
                timestamps      : true,
                paranoid        : true,
                tableName       : EventTypeModel.TableName,
            });
    };

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
