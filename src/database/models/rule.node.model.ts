import DatabaseConnector from '../database.connector';

////////////////////////////////////////////////////////////////////////

export class RuleNodeModel {

    static TableName = 'rule_nodes';

    static ModelName = 'RuleNode';

    static Schema = () => {

        const db = DatabaseConnector;
        const Sequelize: any = db.Sequelize;

        return {
            id : {
                type         : Sequelize.UUID,
                allowNull    : false,
                defaultValue : Sequelize.UUIDV4,
                primaryKey   : true
            }
        };
    }

    static Model: any = () => {

        const db = DatabaseConnector;
        const sequelize = db.sequelize;
        const schema = RuleNodeModel.Schema();

        return sequelize.define(
            RuleNodeModel.ModelName,
            schema, {
                createdAt       : 'CreatedAt',
                updatedAt       : 'UpdatedAt',
                deletedAt       : 'DeletedAt',
                freezeTableName : true,
                timestamps      : true,
                paranoid        : true,
                tableName       : RuleNodeModel.TableName,
            });
    };

    static associate = (models) => {

        //Add associations here...
       
    };

}
