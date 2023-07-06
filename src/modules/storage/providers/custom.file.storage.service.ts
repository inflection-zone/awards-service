import fs from 'fs';
import path from 'path';
import { logger } from '../../../logger/logger';
import { Helper } from '../../../common/helper';
import { IFileStorageService } from '../interfaces/file.storage.service.interface';
import { FileUtils } from '../../../common/utilities/file.utils';

///////////////////////////////////////////////////////////////////////////////////

export class CustomFileStorageService implements IFileStorageService {

    _storagePath: string = path.join(process.env.STORAGE_BUCKET, process.env.NODE_ENV);

    //#region Publics

    exists = async (storageKey: string): Promise<string> => {
        try {
            const location = path.join(this._storagePath, storageKey);
            var fileExists = fs.existsSync(location);
            if (!fileExists) {
                return null;
            }
            return storageKey;
        }
        catch (error) {
            logger.error(JSON.stringify(error, null, 2));
            return null;
        }
    };

    upload = async (storageKey: string, inputStream: any): Promise<string|null|undefined> => {
        return new Promise((resolve, reject) => {
            try {
                var storagePath = FileUtils.getStoragePath();
                const fileLocation = path.join(storagePath, storageKey);
                const fileDirectory = path.dirname(fileLocation);
                if (!fs.existsSync(fileDirectory)){
                    fs.mkdirSync(fileDirectory, { recursive: true });
                }
                const writeStream = fs.createWriteStream(fileLocation);
                inputStream.pipe(writeStream);
                writeStream.on('finish', async () => {
                    logger.info('wrote all data to file');
                    writeStream.end();
                    resolve(storageKey);
                });
            }
            catch (error) {
                logger.error("Unable to create file resource!");
                logger.error(error.message);
                reject(null);
            }
        });
    };

    uploadLocally = async (storageKey: string, localFilePath: string): Promise<string|null|undefined> => {
        try {
            const fileContent = fs.readFileSync(localFilePath);
            const location = path.join(this._storagePath, storageKey);

            const directory = path.dirname(location);
            await fs.promises.mkdir(directory, { recursive: true });

            fs.writeFileSync(location, fileContent, { flag: 'w' });
            return storageKey;
        }
        catch (error) {
            logger.error(error.message);
            return null;
        }
    };

    download = async (storageKey: string): Promise<any> => {
        try {
            var storagePath = FileUtils.getStoragePath();
            const fileLocation = path.join(storagePath, storageKey);
            const stream = fs.createReadStream(fileLocation);
            return stream;
        }
        catch (error) {
            logger.error(error.message);
            return null;
        }
    };

    downloadLocally = async (storageKey: string, localFilePath: string): Promise<string> => {
        try {
            const location = path.join(this._storagePath, storageKey);
            const fileContent = fs.readFileSync(location);

            const directory = path.dirname(localFilePath);
            await fs.promises.mkdir(directory, { recursive: true });

            fs.writeFileSync(localFilePath, fileContent, { flag: 'w' });
            return localFilePath;
        }
        catch (error) {
            logger.error(error.message);
            return null;
        }
    };

    rename = async (storageKey: string, newFileName: string): Promise<boolean> => {
        try {
            var oldPath = path.join(this._storagePath, storageKey);
            var tokens = oldPath.split('/');
            var existingFileName = tokens[tokens.length - 1];
            var newPath = oldPath.replace(existingFileName, newFileName);
            if (newPath === oldPath){
                throw new Error('Old and new file identifiers are same!');
            }
            fs.renameSync(oldPath, newPath);
            return true;
        }
        catch (error) {
            logger.error(error.message);
            return false;
        }
    };

    delete = async (storageKey: string): Promise<boolean> => {
        try {
            const location = path.join(this._storagePath, storageKey);
            fs.unlinkSync(location);
            return true;
        }
        catch (error) {
            logger.error(error.message);
            return false;
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getShareableLink(storageKey: string, _durationInMinutes: number): string {
        return path.join(this._storagePath, storageKey);
    }

    //#endregion

}
