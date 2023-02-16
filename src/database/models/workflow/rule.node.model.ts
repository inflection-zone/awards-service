import DatabaseConnector from '../../database.connector';
const sequelize = DatabaseConnector.sequelize;
import { DataTypes } from 'sequelize';

////////////////////////////////////////////////////////////////////////

export class RuleNodeModel {

    static TableName = 'rule_nodes';

    static ModelName = 'RuleNode';

    static Schema = {
        id : {
            type         : DataTypes.UUID,
            allowNull    : false,
            defaultValue : DataTypes.UUIDV4,
            primaryKey   : true
        }
    };

    static Model: any = sequelize.define(
        RuleNodeModel.ModelName,
        RuleNodeModel.Schema,
        {
            createdAt       : 'CreatedAt',
            updatedAt       : 'UpdatedAt',
            deletedAt       : 'DeletedAt',
            freezeTableName : true,
            timestamps      : true,
            paranoid        : true,
            tableName       : RuleNodeModel.TableName,
        });

    static associate = (models) => {

        //Add associations here...

    };

}
