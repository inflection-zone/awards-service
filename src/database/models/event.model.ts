import DatabaseConnector from '../database.connector';

////////////////////////////////////////////////////////////////////////

export class EventModel {

    static TableName = 'events';

    static ModelName = 'Event';

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
            EventTypeId : {
                type       : Sequelize.UUID,
                allowNull  : false,
                foreignKey : true,
                unique     : false
            },
            ParticipantId : {
                type       : Sequelize.UUID,
                allowNull  : false,
                foreignKey : true,
                unique     : false
            },
            SchemeId : {
                type       : Sequelize.UUID,
                allowNull  : false,
                foreignKey : true,
                unique     : false
            },
            Timestamp : {
                type      : Sequelize.DATE,
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
        const schema = EventModel.Schema();

        return sequelize.define(
            EventModel.ModelName,
            schema, {
                createdAt       : 'CreatedAt',
                updatedAt       : 'UpdatedAt',
                deletedAt       : 'DeletedAt',
                freezeTableName : true,
                timestamps      : true,
                paranoid        : true,
                tableName       : EventModel.TableName,
            });
    };

    static associate = (models) => {

        //Add associations here...

        models.Event.belongsTo(models.EventType, {
            sourceKey : 'EventTypeId',
            targetKey : 'id',
            as        : 'EventType'
        });

        models.Event.belongsTo(models.Participant, {
            sourceKey : 'ParticipantId',
            targetKey : 'id',
            as        : 'Participant'
        });

        models.Event.belongsTo(models.Scheme, {
            sourceKey : 'SchemeId',
            targetKey : 'id',
            as        : 'Scheme'
        });

        models.Event.belongsTo(models.RuleNode, {
            sourceKey : 'RootRuleNodeId',
            targetKey : 'id',
            as        : 'RootRuleNode'
        });

    };

}
