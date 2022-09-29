import DatabaseConnector from '../database.connector';

////////////////////////////////////////////////////////////////////////

export class RuleNodeOperationTypeModel {

    static TableName = 'rule_node_operation_types';

    static ModelName = 'RuleNodeOperationType';

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
            Composition : {
                type      : Sequelize.ENUM(["and", "or"]),
                allowNull : false
            },
            Logical : {
                type      : Sequelize.ENUM(["", ""]),
                allowNull : false
            },
            Mathematical : {
                type      : Sequelize.ENUM(["", ""]),
                allowNull : false
            },

            CreatedAt : Sequelize.DATE,
            UpdatedAt : Sequelize.DATE,
            DeletedAt : Sequelize.DATE
        };
    }

    static Model: any = () => {

        const db = DatabaseConnector;
        const sequelize = db.sequelize;
        const schema = RuleNodeOperationTypeModel.Schema();

        return sequelize.define(
            RuleNodeOperationTypeModel.ModelName,
            schema, {
                createdAt       : 'CreatedAt',
                updatedAt       : 'UpdatedAt',
                deletedAt       : 'DeletedAt',
                freezeTableName : true,
                timestamps      : true,
                paranoid        : true,
                tableName       : RuleNodeOperationTypeModel.TableName,
            });
    };

    static associate = (models) => {

        //Add associations here...

    };

}
