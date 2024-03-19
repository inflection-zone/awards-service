import * as aws from 'aws-sdk';
import fs from 'fs';
import { logger } from '../../../logger/logger';
import { IFileStorageService } from '../interfaces/file.storage.service.interface';

///////////////////////////////////////////////////////////////////////////////////

export class AWSS3FileStorageService implements IFileStorageService {

    //#region Publics

    exists = async (storageKey: string): Promise<string> => {
        try {
            const s3 = this.getS3Client();
            const params = {
                Bucket : process.env.STORAGE_BUCKET,
                Key    : storageKey,
            };
            var stored = await s3.headObject(params).promise();

            logger.info(JSON.stringify(stored, null, 2));

            return storageKey;
        }
        catch (error) {
            logger.error(JSON.stringify(error, null, 2));
            return null;
        }
    };

    upload = async (storageKey: string, inputStream: any): Promise<string|null|undefined> => {
        try {
            const fileContent = fs.readFileSync(inputStream);
            var s3 = this.getS3Client();
            const params = {
                Bucket : process.env.STORAGE_BUCKET,
                Key    : storageKey,
                Body   : fileContent //Request stream piped directly
            };
            var stored = await s3.upload(params).promise();
            logger.info(JSON.stringify(stored, null, 2));
            return storageKey;
        }
        catch (error) {
            logger.error(error.message);
            return null;
        }
    };

    uploadLocally = async (storageKey: string, localFilePath: string): Promise<string|null|undefined> => {

        try {
            const fileContent = fs.readFileSync(localFilePath);

            const s3 = this.getS3Client();
            const params = {
                Bucket : process.env.STORAGE_BUCKET,
                Key    : storageKey,
                Body   : fileContent
            };
            var stored = await s3.upload(params).promise();

            logger.info(JSON.stringify(stored, null, 2));

            return storageKey;
        }
        catch (error) {
            logger.error(error.message);
            return null;
        }
    };

    download = async (storageKey: string, localFilePath?: string): Promise<any> => {
        try {
            const s3 = this.getS3Client();
            const params = {
                Bucket : process.env.STORAGE_BUCKET,
                Key    : storageKey,
            };
            var file = fs.createWriteStream(localFilePath);

            return new Promise((resolve, reject) => {
                s3.getObject(params).createReadStream()
                    .on('end', () => {
    
                        //var st = fs.existsSync(localFilePath);
    
                        var stats = fs.statSync(localFilePath);
                        var count = 0;
                        while (stats.size === 0 && count < 5) {
                            setTimeout(() => {
                                stats = fs.statSync(localFilePath);
                            }, 3000);
                            count++;
                        }
                        return resolve(localFilePath);
                    })
                    .on('error', (error) => {
                        return reject(error);
                    })
                    .pipe(file);
            });
        }
        catch (error) {
            logger.error(error.message);
            return null;
        }
    };

    downloadLocally = async (storageKey: string, localFilePath: string): Promise<string> => {

        const s3 = this.getS3Client();
        const params = {
            Bucket : process.env.STORAGE_BUCKET,
            Key    : storageKey,
        };

        //var s3Path = storageKey;
        // var tokens = s3Path.split('/');
        // var localFile = tokens[tokens.length - 1];
        // var folderPath = path.join(TEMP_DOWNLOAD_FOLDER, localFolder);
        // var localDestination = path.join(folderPath, localFile);

        var file = fs.createWriteStream(localFilePath);

        return new Promise((resolve, reject) => {
            s3.getObject(params).createReadStream()
                .on('end', () => {

                    //var st = fs.existsSync(localFilePath);

                    var stats = fs.statSync(localFilePath);
                    var count = 0;
                    while (stats.size === 0 && count < 5) {
                        setTimeout(() => {
                            stats = fs.statSync(localFilePath);
                        }, 3000);
                        count++;
                    }
                    return resolve(localFilePath);
                })
                .on('error', (error) => {
                    return reject(error);
                })
                .pipe(file);
        });
    };

    rename = async (storageKey: string, newFileName: string): Promise<boolean> => {

        const s3 = this.getS3Client();

        var s3Path = storageKey;
        var tokens = s3Path.split('/');
        var existingFileName = tokens[tokens.length - 1];
        var newPath = s3Path.replace(existingFileName, newFileName);
        if (newPath === s3Path){
            throw new Error('Old and new file identifiers are same!');
        }

        var BUCKET_NAME = process.env.STORAGE_BUCKET;
        var OLD_KEY = s3Path;
        var NEW_KEY = newPath;

        const params = {
            Bucket     : BUCKET_NAME,
            CopySource : `${BUCKET_NAME}/${OLD_KEY}`,
            Key        : NEW_KEY
        };

        await s3.copyObject(params).promise();
        await s3.deleteObject({
            Bucket : BUCKET_NAME,
            Key    : OLD_KEY
        }).promise();

        return true;
    };

    delete = async (storageKey: string): Promise<boolean> => {

        const s3 = this.getS3Client();
        const params = {
            Bucket : process.env.STORAGE_BUCKET,
            Key    : storageKey
        };

        var result = await s3.deleteObject(params).promise();
        if (result.$response.error) {
            return false;
        }
        return true;
    };

    getShareableLink(storageKey: string, durationInMinutes: number): string {

        const s3 = new aws.S3({
            accessKeyId      : process.env.STORAGE_BUCKET_ACCESS_KEY_ID,
            secretAccessKey  : process.env.STORAGE_BUCKET_ACCESS_KEY_SECRET,
            signatureVersion : 'v4',
            region           : process.env.STORAGE_CLOUD_REGION
        });

        const url = s3.getSignedUrl('getObject', {
            Bucket  : process.env.STORAGE_BUCKET,
            Key     : storageKey,
            Expires : 60 * durationInMinutes
        });

        return url;
    }

    //#endregion

    //#region Privates

    getS3Client = (): aws.S3 => {
        return new aws.S3({
            accessKeyId     : process.env.STORAGE_BUCKET_ACCESS_KEY_ID,
            secretAccessKey : process.env.STORAGE_BUCKET_ACCESS_KEY_SECRET
        });
    };

    //#endregion

}
