import DatabaseConnector from '../../database.connector';
const sequelize = DatabaseConnector.sequelize;
import { DataTypes } from 'sequelize';

////////////////////////////////////////////////////////////////////////

export class SchemeModel {

    static TableName = 'schemes';

    static ModelName = 'Scheme';

    static Schema = {
        id : {
            type         : DataTypes.UUID,
            allowNull    : false,
            defaultValue : DataTypes.UUIDV4,
            primaryKey   : true
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
        ValidFrom : {
            type      : DataTypes.DATE,
            allowNull : false
        },
        ValidTill : {
            type      : DataTypes.DATE,
            allowNull : false
        },

        CreatedAt : DataTypes.DATE,
        UpdatedAt : DataTypes.DATE,
        DeletedAt : DataTypes.DATE
    };

    static Model: any = sequelize.define(
        SchemeModel.ModelName,
        SchemeModel.Schema,
        {
            createdAt       : 'CreatedAt',
            updatedAt       : 'UpdatedAt',
            deletedAt       : 'DeletedAt',
            freezeTableName : true,
            timestamps      : true,
            paranoid        : true,
            tableName       : SchemeModel.TableName,
        });

    static associate = (models) => {

        //Add associations here...

        models.Scheme.belongsTo(models.Client, {
            sourceKey : 'ClientId',
            targetKey : 'id',
            as        : 'Client'
        });

    };

}
