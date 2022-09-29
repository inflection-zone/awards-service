import DatabaseConnector from '../database.connector';

////////////////////////////////////////////////////////////////////////

export class ParticipantModel {

    static TableName = 'participants';

    static ModelName = 'Participant';

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
            ClientId : {
                type       : Sequelize.UUID,
                allowNull  : false,
                foreignKey : true,
                unique     : false
            },
            FirstName : {
                type      : Sequelize.STRING(64),
                allowNull : false
            },
            LastName : {
                type      : Sequelize.STRING(64),
                allowNull : false
            },
            Phone : {
                type      : Sequelize.STRING(16),
                allowNull : true
            },
            Email : {
                type      : Sequelize.STRING(256),
                allowNull : true
            },
            Gender : {
                type         : Sequelize.ENUM(["Male", "Female", "Other"]),
                allowNull    : false,
                defaultValue : 'Male'
            },
            BirthDate : {
                type      : Sequelize.DATE,
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
        const schema = ParticipantModel.Schema();

        return sequelize.define(
            ParticipantModel.ModelName,
            schema, {
                createdAt       : 'CreatedAt',
                updatedAt       : 'UpdatedAt',
                deletedAt       : 'DeletedAt',
                freezeTableName : true,
                timestamps      : true,
                paranoid        : true,
                tableName       : ParticipantModel.TableName,
            });
    };

    static associate = (models) => {

        //Add associations here...

        models.Participant.belongsTo(models.Client, {
            sourceKey : 'ClientId',
            targetKey : 'id',
            as        : 'Client'
        });

    };

}
