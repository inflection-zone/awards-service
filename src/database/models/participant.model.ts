import DatabaseConnector from '../database.connector';
const sequelize = DatabaseConnector.sequelize;
import { DataTypes } from 'sequelize';

////////////////////////////////////////////////////////////////////////

export class ParticipantModel {

    static TableName = 'participants';

    static ModelName = 'Participant';

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
        FirstName : {
            type      : DataTypes.STRING(64),
            allowNull : false
        },
        LastName : {
            type      : DataTypes.STRING(64),
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
        Gender : {
            type         : DataTypes.ENUM({ values: ["Male", "Female", "Other"] }),
            allowNull    : false,
            defaultValue : 'Male'
        },
        BirthDate : {
            type      : DataTypes.DATE,
            allowNull : false
        },

        CreatedAt : DataTypes.DATE,
        UpdatedAt : DataTypes.DATE,
        DeletedAt : DataTypes.DATE
    };

    static Model: any = sequelize.define(
        ParticipantModel.ModelName,
        ParticipantModel.Schema,
        {
            createdAt       : 'CreatedAt',
            updatedAt       : 'UpdatedAt',
            deletedAt       : 'DeletedAt',
            freezeTableName : true,
            timestamps      : true,
            paranoid        : true,
            tableName       : ParticipantModel.TableName,
        });

    static associate = (models) => {

        //Add associations here...

        models.Participant.belongsTo(models.Client, {
            sourceKey : 'ClientId',
            targetKey : 'id',
            as        : 'Client'
        });

    };

}
