import DatabaseConnector from '../database.connector';
const sequelize = DatabaseConnector.sequelize;
import { DataTypes } from 'sequelize';

////////////////////////////////////////////////////////////////////////

export class ClientModel {

    static TableName = 'clients';

    static ModelName = 'Client';

    static Schema = {
        id : {
            type         : DataTypes.UUID,
            allowNull    : false,
            defaultValue : DataTypes.UUIDV4,
            primaryKey   : true
        },
        ClientName : {
            type      : DataTypes.STRING(256),
            allowNull : false
        },
        ClientCode : {
            type      : DataTypes.STRING(32),
            allowNull : false
        },
        Phone : {
            type      : DataTypes.STRING(16),
            allowNull : true
        },
        Email : {
            type      : DataTypes.STRING(256),
            allowNull : true
        },

        CreatedAt : DataTypes.DATE,
        UpdatedAt : DataTypes.DATE,
        DeletedAt : DataTypes.DATE
    };

    static Model: any = sequelize.define(
        ClientModel.ModelName,
        ClientModel.Schema,
        {
            createdAt       : 'CreatedAt',
            updatedAt       : 'UpdatedAt',
            deletedAt       : 'DeletedAt',
            freezeTableName : true,
            timestamps      : true,
            paranoid        : true,
            tableName       : ClientModel.TableName,
        });

    static associate = (models) => {

        //Add associations here...

    };

}
