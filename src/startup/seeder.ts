import fs from "fs";
import path from "path";
import { Helper } from "../common/helper";
import { logger } from "../logger/logger";
import * as RolePrivilegesList from '../../seed.data/role.privileges.json';
import { UserService } from '../database/repository.services/user/user.service';
import { ClientService } from '../database/repository.services/client/client.service';
import { UserCreateModel } from "../domain.types/user/user.domain.types";
import { Gender } from "../domain.types/miscellaneous/system.types";
import { RoleService } from "../database/repository.services/user/role.service";
import { FileResourceService } from "../database/repository.services/general/file.resource.service";
import { PrivilegeService } from "../database/repository.services/user/privilege.service";
import { RoleCreateModel } from "../domain.types/user/role.domain.types";
import { ClientResponseDto } from "../domain.types/client/client.domain.types";

//////////////////////////////////////////////////////////////////////////////

export class Seeder {

    _clientService: ClientService = new ClientService();

    _userService: UserService = new UserService();

    _roleService: RoleService = new RoleService();

    _privilegeService: PrivilegeService = new PrivilegeService();

    _fileResourceService: FileResourceService = null;

    public seed = async (): Promise<void> => {
        try {
            await this.createTempFolders();
            await this.seedDefaultRoles();
            const clients = await this.seedInternalClients();
            await this.seedRolePrivileges();
            await this.seedDefaultUsers(clients);
        } catch (error) {
            logger.error(error.message);
        }
    };

    private createTempFolders = async () => {
        await Helper.createTempDownloadFolder();
        await Helper.createTempUploadFolder();
    };

    private seedRolePrivileges = async () => {
        try {
            const arr = RolePrivilegesList['default'];
            for (let i = 0; i < arr.length; i++) {
                const rp = arr[i];
                const roleName = rp['Role'];
                const privileges = rp['Privileges'];

                const role = await this._roleService.getByRoleName(roleName);
                if (role == null) {
                    continue;
                }
                for (const privilege of privileges) {
                    var privilegeDto = await this._privilegeService.getByPrivilegeName(privilege);
                    if (!privilegeDto) {
                        privilegeDto = await this._privilegeService.create({
                            Name : privilege,
                        });
                    }
                    await this._privilegeService.addToRole(privilegeDto.id, role.id);
                }
            }
        } catch (error) {
            logger.info('Error occurred while seeding role-privileges!');
        }
        logger.info('Seeded role-privileges successfully!');
    };

    private seedDefaultUsers = async (clients: ClientResponseDto[]) => {

        var internalClient: ClientResponseDto = null;
        if (clients && clients.length > 0)
        {
            internalClient = clients[0];
        }

        const defaultUsers = this.loadJSONSeedFile('default.users.seed.json');

        for await (var u of defaultUsers) {

            const role = await this._roleService.getByRoleName(u.Role);

            const existingUser = await this._userService.getUser(null, null, null, u.UserName);
            if (existingUser) {
                continue;
            }

            const createModel : UserCreateModel = {
                ClientId    : internalClient ? internalClient.id : null,
                Phone       : u.Phone,
                FirstName   : u.FirstName,
                LastName    : u.LastName,
                UserName    : u.UserName,
                Password    : u.Password,
                RoleId      : role.id,
                CountryCode : u.CountryCode,
                Email       : u.Email,
                Gender      : Gender.Male,
                BirthDate   : null,
                Prefix      : ""
            };

            createModel.Password = Helper.generateHashedPassword(u.Password);
            const user = await this._userService.create(createModel);
            logger.info(JSON.stringify(user, null, 2));
        }

        logger.info('Seeded default users successfully!');
    };

    private loadJSONSeedFile(file: string): any {
        var filepath = path.join(process.cwd(), 'seed.data', file);
        var fileBuffer = fs.readFileSync(filepath, 'utf8');
        const obj = JSON.parse(fileBuffer);
        return obj;
    }

    private seedInternalClients = async () => {

        logger.info('Seeding internal clients...');

        const clients: ClientResponseDto[] = [];

        const arr = this.loadJSONSeedFile('internal.clients.seed.json');

        for (let i = 0; i < arr.length; i++) {
            var c = arr[i];
            let client = await this._clientService.getByClientCode(c.Code);
            if (client == null) {
                const model = {
                    Name         : c['Name'],
                    Code         : c['Code'],
                    IsPrivileged : c['IsPrivileged'],
                    CountryCode  : '+91',
                    Phone        : '1000000000',
                    Email        : c['Email'],
                    Password     : c['Password'],
                    ValidFrom    : new Date(),
                    ValidTill    : new Date(2030, 12, 31),
                    ApiKey       : c['ApiKey'],
                };
                client = await this._clientService.create(model);
                logger.info(JSON.stringify(client, null, 2));
            }
            clients.push(client);
        }
        return clients;

    };

    private seedDefaultRoles = async () => {

        const defaultRoles = [
            {
                Name        : 'Admin',
                Description : 'Administrator of the Awards service'
            },
            {
                Name        : 'ContentModerator',
                Description : 'The content moderator representing a particular client.'
            }
        ];

        for await (var role of defaultRoles) {
            var existing = await this._roleService.getByRoleName(role.Name);
            if (!existing) {
                const model: RoleCreateModel = {
                    ...role
                };
                await this._roleService.create(model);
            }
        }

        logger.info('Seeded default roles successfully!');
    };

}
