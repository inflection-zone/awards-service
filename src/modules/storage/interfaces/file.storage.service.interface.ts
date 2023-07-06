
export interface IFileStorageService {

    exists(storageKey: string): Promise<string>;
    
    upload(storageKey: string, inputStream): Promise<string|null|undefined>;
    
    download(storageKey: string, localFilePath: string): Promise<any>;
    
    uploadLocally(storageKey: string, localFilePath?: string): Promise<string|null|undefined>;
    
    downloadLocally(storageKey: string, localFilePath: string): Promise<string>;

    rename(existingStorageKey: string, newFileName: string): Promise<boolean>;

    getShareableLink(storageKey: string, durationInMinutes: number): string;

    delete(storageKey: string): Promise<boolean>;
}
