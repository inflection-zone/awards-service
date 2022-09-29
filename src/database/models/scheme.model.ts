import DatabaseConnector from '../database.connector';
////////////////////////////////////////////////////////////////////////

export class SchemeModel {

    static TableName = 'schemes';

    static ModelName = 'Scheme';

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
            Name : {
                type      : Sequelize.STRING(256),
                allowNull : false
            },
            Description : {
                type      : Sequelize.STRING(512),
                allowNull : true
            },
            ValidFrom : {
                type      : Sequelize.DATE,
                allowNull : false
            },
            ValidTill : {
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
        const schema = SchemeModel.Schema();

        return sequelize.define(
            SchemeModel.ModelName,
            schema, {
                createdAt       : 'CreatedAt',
                updatedAt       : 'UpdatedAt',
                deletedAt       : 'DeletedAt',
                freezeTableName : true,
                timestamps      : true,
                paranoid        : true,
                tableName       : SchemeModel.TableName,
            });
    };

    static associate = (models) => {

        //Add associations here...

        models.Scheme.belongsTo(models.Client, {
            sourceKey : 'ClientId',
            targetKey : 'id',
            as        : 'Client'
        });

    };

}
