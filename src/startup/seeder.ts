import fs from "fs";
import path from "path";
import { Helper } from "../common/helper";
import { logger } from "../logger/logger";
//import * as RolePrivilegesList from '../../seed.data/role.privileges.json';
// import { RoleService } from '../database/repository.services/role.service';
// import { UserRoleService } from '../database/repository.services/user/user.role.service';
// import { RolePrivilegeService } from '../database/repository.services/role.privilege.service';
import { UserService } from '../database/repository.services/user/user.service';
import { ClientService } from '../database/repository.services/client/client.service';
//import { RoleList } from '../domain.types/miscellaneous/role.types';
import { UserCreateModel } from "../domain.types/user/user.domain.types";
import { Gender } from "../domain.types/miscellaneous/system.types";
// import { UserRoleCreateModel } from "../domain.types/user/user.role.domain.types";

//////////////////////////////////////////////////////////////////////////////

export class Seeder {

    _clientService: ClientService = new ClientService();

    _userService: UserService = new UserService();

    // _roleService: RoleService = new RoleService();

    // _rolePrivilegeService: RolePrivilegeService = new RolePrivilegeService();

    // _userRoleService: UserRoleService = new UserRoleService();

    //_careplanCategoryService: CareplanCategoryService = new CareplanCategoryService();

    // _fileResourceService: FileResourceService = null;

    public seed = async (): Promise<void> => {
        try {
            await this.createTempFolders();
            // await this.seedDefaultRoles();
            // await this.seedRolePrivileges();
            await this.seedInternalClients();
            await this.seedDefaultUsers();
        } catch (error) {
            logger.error(error.message);
        }
    };

    private createTempFolders = async () => {
        await Helper.createTempDownloadFolder();
        await Helper.createTempUploadFolder();
    };

    // private seedRolePrivileges = async () => {
    //     try {
    //         const arr = RolePrivilegesList['default'];
    //         for (let i = 0; i < arr.length; i++) {
    //             const rp = arr[i];
    //             const roleName = rp['Role'];
    //             const privileges = rp['Privileges'];

    //             const role = await this._roleService.getByName(roleName);
    //             if (role == null) {
    //                 continue;
    //             }
    //             for (const privilege of privileges) {
    //                 const exists = await this._rolePrivilegeService.hasPrivilegeForRole(role.id, privilege);
    //                 if (!exists) {
    //                     await this._rolePrivilegeService.create({
    //                         RoleId    : role.id,
    //                         RoleName  : role.RoleName,
    //                         Privilege : privilege,
    //                     });
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         logger.log('Error occurred while seeding role-privileges!');
    //     }
    //     logger.log('Seeded role-privileges successfully!');
    // };

    private seedDefaultUsers = async () => {

        const defaultUsers = this.loadJSONSeedFile('default.users.seed.json');

        for await (var u of defaultUsers) {

            // const role = await this._roleService.getByName(u.Role);

            const existingUser = await this._userService.getUser(null, null, null, u.UserName);
            if (existingUser) {
                continue;
            }

            const createModel : UserCreateModel = {
                Phone       : u.Phone,
                FirstName   : u.FirstName,
                LastName    : u.LastName,
                UserName    : u.UserName,
                Password    : u.Password,
                //RoleId      : role.id,
                CountryCode : u.CountryCode,
                Email       : u.Email,
                Gender      : Gender.Male,
                BirthDate   : null,
                Prefix      : ""
            };

            createModel.Password = Helper.generateHashedPassword(u.Password);
            const user = await this._userService.create(createModel);
            logger.info(JSON.stringify(user, null, 2));

            // const userRole: UserRoleCreateModel = {
            //     UserId : user.id,
            //     RoleId : role.id,
            // };
            // await this._userRoleService.create(userRole);
        }

        logger.info('Seeded admin and moderator successfully!');
    };

    private loadJSONSeedFile(file: string): any {
        var filepath = path.join(process.cwd(), 'seed.data', file);
        var fileBuffer = fs.readFileSync(filepath, 'utf8');
        const obj = JSON.parse(fileBuffer);
        return obj;
    }

    private seedInternalClients = async () => {

        logger.info('Seeding internal clients...');

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
        }

    };

    // private seedDefaultRoles = async () => {

    //     for await (var role of RoleList) {

    //         var r = await this._roleService.getByName(role);
    //         if (!r) {
    //             await this._roleService.create({
    //                 RoleName : role
    //             });
    //         }
    //     }

    //     logger.log('Seeded default roles successfully!');
    // };

}
