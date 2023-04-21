import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { FileStorageInjector } from './storage/file.storage.injector';
import { ProcessorsInjector } from './processor/processor.injector';

////////////////////////////////////////////////////////////////////////////////

export class ModuleInjector {

    static registerInjections(container: DependencyContainer) {
        FileStorageInjector.registerInjections(container);
        ProcessorsInjector.registerInjections(container);
    }

}
