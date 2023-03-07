import * as fs from 'fs';
import * as mime from 'mime-types';
import path from 'path';
import { ConfigurationManager } from '../../config/configuration.manager';
import { TimeUtils } from './time.utils';

////////////////////////////////////////////////////////////////////////

export class FileUtils {

    static getStoragePath = (): string => {
        return path.join(process.env.STORAGE, process.env.NODE_ENV);
    };

    static dumpJsonToFile(obj, filename: string): void {
        const txt = JSON.stringify(obj, null, '    ');
        fs.writeFileSync(filename, txt);
    }

    static jsonFileToObj = (jsonPath: string) => {

        if (!fs.existsSync(jsonPath)) {
            return null;
        }

        const rawdata = fs.readFileSync(jsonPath, {
            encoding : 'utf8',
            flag     : 'r',
        });

        const obj = JSON.parse(rawdata);
        return obj;
    };

    public static getFileExtension = (filename: string) => {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? "" : ext[1];
    };

    public static getFilenameFromFilePath = (filepath: string) => {
        return path.basename(filepath);
    };

    public static generateDownloadFolderPath = async() => {
        var timestamp = TimeUtils.timestamp(new Date());
        var tempDownloadFolder = ConfigurationManager.DownloadTemporaryFolder;
        var downloadFolderPath = path.join(tempDownloadFolder, timestamp);
        await fs.promises.mkdir(downloadFolderPath, { recursive: true });
        return downloadFolderPath;
    };

    public static createTempDownloadFolder = async() => {
        var tempDownloadFolder = ConfigurationManager.DownloadTemporaryFolder;
        if (fs.existsSync(tempDownloadFolder)) {
            return tempDownloadFolder;
        }
        await fs.promises.mkdir(tempDownloadFolder, { recursive: true });
        return tempDownloadFolder;
    };

    public static createTempUploadFolder = async() => {
        var tempUploadFolder = ConfigurationManager.UploadTemporaryFolder;
        if (fs.existsSync(tempUploadFolder)) {
            return tempUploadFolder;
        }
        await fs.promises.mkdir(tempUploadFolder, { recursive: true });
        return tempUploadFolder;
    };

    public static stringToFilename = (str: string, extension: string, delimiter: string, limitTo = 32): string => {
        var tmp = str.replace(' ', delimiter);
        tmp = tmp.substring(0, limitTo);
        var ext = extension.startsWith('.') ? extension : '.' + extension;
        return tmp + ext;
    };

    public static getMimeType = (pathOrExtension: string) => {
        var mimeType = mime.lookup(pathOrExtension);
        if (!mimeType) {
            mimeType = 'text/plain';
        }
        return mimeType;
    };

}
