import path from 'path';
import * as defaultConfiguration from '../../service.config.json';
import * as localConfiguration from '../../service.config.local.json';
import {
    AuthenticationType,
    AuthorizationType, Configurations,
    FileStorageProvider
} from './configuration.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class ConfigurationManager {

    static _config: Configurations = null;

    public static loadConfigurations = (): void => {

        const configuration = process.env.NODE_ENV === 'local' ? localConfiguration : defaultConfiguration;

        ConfigurationManager._config = {
            SystemIdentifier : configuration.SystemIdentifier,
            BaseUrl          : process.env.BASE_URL,
            Auth             : {
                Authentication : configuration.Auth.Authentication as AuthenticationType,
                Authorization  : configuration.Auth.Authorization as AuthorizationType,
            },
            FileStorage : {
                Provider : configuration.FileStorage.Provider as FileStorageProvider,
            },
            TemporaryFolders : {
                Upload                     : configuration.TemporaryFolders.Upload as string,
                Download                   : configuration.TemporaryFolders.Download as string,
                CleanupFolderBeforeMinutes : configuration.TemporaryFolders.CleanupFolderBeforeMinutes as number,
            },
            MaxUploadFileSize : configuration.MaxUploadFileSize,
            JwtExpiresIn      : configuration.JwtExpiresIn
        };
    };

    public static BaseUrl = (): string => {
        return ConfigurationManager._config.BaseUrl;
    };

    public static SystemIdentifier = (): string => {
        return ConfigurationManager._config.SystemIdentifier;
    };

    public static Authentication = (): AuthenticationType => {
        return ConfigurationManager._config.Auth.Authentication;
    };

    public static Authorization = (): AuthorizationType => {
        return ConfigurationManager._config.Auth.Authorization;
    };

    public static MaxUploadFileSize = (): number => {
        return ConfigurationManager._config.MaxUploadFileSize;
    };

    public static JwtExpiresIn = (): number => {
        return ConfigurationManager._config.JwtExpiresIn;
    }

    public static FileStorageProvider = (): FileStorageProvider => {
        return ConfigurationManager._config.FileStorage.Provider;
    };

    public static UploadTemporaryFolder = (): string => {
        var location = ConfigurationManager._config.TemporaryFolders.Upload;
        return path.join(process.cwd(), location);
    };

    public static DownloadTemporaryFolder = (): string => {
        var location = ConfigurationManager._config.TemporaryFolders.Download;
        return path.join(process.cwd(), location);
    };

    public static TemporaryFolderCleanupBefore = (): number => {
        return ConfigurationManager._config.TemporaryFolders.CleanupFolderBeforeMinutes;
    };

}
