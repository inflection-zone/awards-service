import {
    DatabaseConnector
} from '../database.connector';

////////////////////////////////////////////////////////////////////////

export class ClientModel {

    static TableName = 'clients';

    static ModelName = 'Client';

    static Schema = () => {

        const db = DatabaseConnector.db();
        const Sequelize: any = db.Sequelize;

        return {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            ClientName: {
                type: Sequelize.STRING(256),
                allowNull: false
            },
            ClientCode: {
                type: Sequelize.STRING(32),
                allowNull: false
            },
            Phone: {
                type: Sequelize.STRING(16),
                allowNull: true
            },
            Email: {
                type: Sequelize.STRING(256),
                allowNull: true
            },

            CreatedAt: Sequelize.DATE,
            UpdatedAt: Sequelize.DATE,
            DeletedAt: Sequelize.DATE
        };
    }

    static Model: any = () => {

        const db = DatabaseConnector.db();
        const sequelize = db.sequelize;
        const schema = ClientModel.Schema();

        return sequelize.define(
            ClientModel.ModelName,
            schema, {
                createdAt: 'CreatedAt',
                updatedAt: 'UpdatedAt',
                deletedAt: 'DeletedAt',
                freezeTableName: true,
                timestamps: true,
                paranoid: true,
                tableName: ClientModel.TableName,
            });
    };

    static associate = (models) => {

        //Add associations here...


    };

}