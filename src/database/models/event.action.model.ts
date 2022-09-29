import DatabaseConnector from '../database.connector';

////////////////////////////////////////////////////////////////////////

export class EventActionModel {

    static TableName = 'event_actions';

    static ModelName = 'EventAction';

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
            EventActionTypeId : {
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
        const schema = EventActionModel.Schema();

        return sequelize.define(
            EventActionModel.ModelName,
            schema, {
                createdAt       : 'CreatedAt',
                updatedAt       : 'UpdatedAt',
                deletedAt       : 'DeletedAt',
                freezeTableName : true,
                timestamps      : true,
                paranoid        : true,
                tableName       : EventActionModel.TableName,
            });
    };

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
