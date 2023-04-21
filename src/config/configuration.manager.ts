import path from 'path';
import * as defaultConfiguration from '../../service.config.json';
import * as localConfiguration from '../../service.config.local.json';
import {
    AuthenticationType,
    AuthorizationType, Configurations,
    FileStorageProvider,
    Processor,
    ProcessorsProvider
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
            Processor: {
                Provider: configuration.Processor?.Provider as ProcessorsProvider,
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
            JwtExpiresIn      : configuration.JwtExpiresIn,
            Logger            : configuration.Logger,
            UseHTTPLogging    : configuration.UseHTTPLogging,
        };
    };

    public static get BaseUrl(): string {
        return ConfigurationManager._config.BaseUrl;
    }

    public static  get SystemIdentifier(): string {
        return ConfigurationManager._config.SystemIdentifier;
    }

    public static get Authentication(): AuthenticationType {
        return ConfigurationManager._config.Auth.Authentication;
    }

    public static get Authorization(): AuthorizationType {
        return ConfigurationManager._config.Auth.Authorization;
    }

    public static get MaxUploadFileSize(): number {
        return ConfigurationManager._config.MaxUploadFileSize;
    }

    public static get Processor(): Processor {
        return ConfigurationManager._config?.Processor;
    }

    public static get Logger(): string {
        return ConfigurationManager._config?.Logger;
    }

    public static get UseHTTPLogging(): boolean {
        return ConfigurationManager._config?.UseHTTPLogging;
    }

    public static get JwtExpiresIn(): number {
        return ConfigurationManager._config.JwtExpiresIn;
    }

    public static get FileStorageProvider(): FileStorageProvider {
        return ConfigurationManager._config.FileStorage.Provider;
    }

    public static get UploadTemporaryFolder(): string {
        var location = ConfigurationManager._config.TemporaryFolders.Upload;
        return path.join(process.cwd(), location);
    }

    public static get DownloadTemporaryFolder(): string {
        var location = ConfigurationManager._config.TemporaryFolders.Download;
        return path.join(process.cwd(), location);
    }

    public static get TemporaryFolderCleanupBefore(): number {
        return ConfigurationManager._config.TemporaryFolders.CleanupFolderBeforeMinutes;
    }

}

ConfigurationManager.loadConfigurations();
