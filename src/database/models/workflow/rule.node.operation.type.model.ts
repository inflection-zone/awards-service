import DatabaseConnector from '../../database.connector';
const sequelize = DatabaseConnector.sequelize;
import { DataTypes } from 'sequelize';

////////////////////////////////////////////////////////////////////////

export class RuleNodeOperationTypeModel {

    static TableName = 'rule_node_operation_types';

    static ModelName = 'RuleNodeOperationType';

    static Schema = {
        id : {
            type         : DataTypes.UUID,
            allowNull    : false,
            defaultValue : DataTypes.UUIDV4,
            primaryKey   : true
        },
        Composition : {
            type      : DataTypes.ENUM({ values: ["and", "or", "xor"] }),
            allowNull : false
        },
        Logical : {
            type      : DataTypes.ENUM({ values: ["equals", "lessThan"] }),
            allowNull : false
        },
        Mathematical : {
            type      : DataTypes.ENUM({ values: ["add", "subtract", "divide", "multiply", "percentage"] }),
            allowNull : false
        },

        CreatedAt : DataTypes.DATE,
        UpdatedAt : DataTypes.DATE,
        DeletedAt : DataTypes.DATE
    };

    static Model: any = sequelize.define(
        RuleNodeOperationTypeModel.ModelName,
        RuleNodeOperationTypeModel.Schema,
        {
            createdAt       : 'CreatedAt',
            updatedAt       : 'UpdatedAt',
            deletedAt       : 'DeletedAt',
            freezeTableName : true,
            timestamps      : true,
            paranoid        : true,
            tableName       : RuleNodeOperationTypeModel.TableName,
        });

    static associate = (models) => {

        //Add associations here...

    };

}
