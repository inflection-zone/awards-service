import fs from "fs";
import path from "path";
import { logger } from "../logger/logger";
import * as RolePrivilegesList from '../../seed.data/role.privileges.json';
import * as seedHowToEarnBadgeContent from '../../seed.data/how.to.earn.badge.content.seed..json';
import { UserService } from '../database/services/user/user.service';
import { UserCreateModel } from "../domain.types/user/user.domain.types";
import { Gender } from "../domain.types/miscellaneous/system.types";
import { RoleService } from "../database/services/user/role.service";
import { FileResourceService } from "../database/services/general/file.resource.service";
import { PrivilegeService } from "../database/services/user/privilege.service";
import { RoleCreateModel } from "../domain.types/user/role.domain.types";
import { ClientResponseDto } from "../domain.types/client/client.domain.types";
import { FileUtils } from "../common/utilities/file.utils";
import { StringUtils } from "../common/utilities/string.utils";
import { BadgeStockImageDomainModel } from "../domain.types/badge.stock.image/badge.stock.image.domain.model";
import { BadgeStockImageService } from "../database/services/badge.stock.images/badge.stock.image.service";
import { ClientService } from "../database/services/client/client.service";
import { Loader } from "./loader";
import { BadgeService } from "../database/services/awards/badge.service";
import { BadgeUpdateModel } from "../domain.types/awards/badge.domain.types";

//////////////////////////////////////////////////////////////////////////////

export class Seeder {

    _clientService: ClientService = new ClientService();

    _userService: UserService = new UserService();

    _roleService: RoleService = new RoleService();

    _privilegeService: PrivilegeService = new PrivilegeService();

    _fileResourceService: FileResourceService = null;

    _badgeStockImageService: BadgeStockImageService = new BadgeStockImageService();

    _badgeService: BadgeService = new BadgeService();

    constructor () {

        this._fileResourceService = Loader.Container.resolve(FileResourceService);

    }


    public seed = async (): Promise<void> => {
        try {
            await this.createTempFolders();
            await this.seedDefaultRoles();
            const clients = await this.seedInternalClients();
            await this.seedRolePrivileges();
            await this.seedDefaultUsers(clients);
            await this.seedBadgeStockImages();
            await this.seedHowToEarnBadgeContent();
        } catch (error) {
            logger.error(error.message);
        }
    };

    private createTempFolders = async () => {
        await FileUtils.createTempDownloadFolder();
        await FileUtils.createTempUploadFolder();
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

            createModel.Password = StringUtils.generateHashedPassword(u.Password);
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

    private seedBadgeStockImages = async () => {

        var images = await this._badgeStockImageService.getAll();
        if (images.length > 0) {
            return;
        }

        var destinationStoragePath = 'assets/images/stock.badge.images/';
        var sourceFilePath = path.join(process.cwd(), "./assets/images/stock.badge.images/");

        var files = fs.readdirSync(sourceFilePath);
        var imageFiles = files.filter((f) => {
            return path.extname(f).toLowerCase() === '.png';
        });

        for await (const fileName of imageFiles) {

            var sourceLocation = path.join(sourceFilePath, fileName);
            var storageKey = destinationStoragePath + fileName;

            var uploaded = await this._fileResourceService.uploadLocal(
                storageKey,
                sourceLocation,
                true);
            
            if (!uploaded) {
                continue;
            }

            var domainModel: BadgeStockImageDomainModel = {
                Code       : fileName.replace('.png', ''),
                FileName   : fileName,
                ResourceId : uploaded.id,
                PublicUrl  : uploaded.DefaultVersion.Url
            };

            var badgeStockImage = await this._badgeStockImageService.create(domainModel);
            if (!badgeStockImage) {
                logger.info('Error occurred while seeding badge stock images!');
            }
        }
    };

    public seedHowToEarnBadgeContent = async () => {

        logger.info('Seeding how to earn content for badges...');

        const arr = seedHowToEarnBadgeContent['default'];
        //console.log(JSON.stringify(arr, null, 2));

        for (let i = 0; i < arr.length; i++) {

            const filters = {
                Name : arr[i]['Name']
            };

            const existingRecord = await this._badgeService.search(filters);
            //console.log(JSON.stringify(existingRecord, null, 2));
            
            if (existingRecord.Items.length > 0) {

                const entity = existingRecord.Items[0];
                const model: BadgeUpdateModel = {
                    HowToEarn       : arr[i]['HowToEarn'],
                    ClientId        : entity.Client.id,
                    CategoryId      : entity.Category.id
                };
    
                var record = await this._badgeService.update(entity.id, model);
                var str = JSON.stringify(record, null, '  ');
                logger.info(str);
            }   

        }
    };

}
