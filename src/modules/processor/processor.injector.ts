import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { DataComparator } from './providers/implementation/data.comparator';
import { DataExtractor } from './providers/implementation/data.extractors/data.extractor';
import { DataProcessorr } from './providers/implementation/data.processor';
import { DataStore } from './providers/implementation/data.stores/data.store';
import { MockDataComparator } from './providers/mock/mock.data.comparator';
import { MockDataExtractor } from './providers/mock/mock.data.extractor';
import { MockDataProcessorr } from './providers/mock/mock.data.processor';
import { MockDataStore } from './providers/mock/mock.data.store';
import { ConfigurationManager } from '../../config/configuration.manager';

////////////////////////////////////////////////////////////////////////////////

export class ProcessorsInjector {

    static registerInjections(container: DependencyContainer) {

        const processor = ConfigurationManager.Processor;
        if (processor.Provider === 'Mock') {
            container.register('IDataComparator', MockDataComparator);
            container.register('IDataExtractor', MockDataExtractor);
            container.register('IDataProcessor', MockDataProcessorr);
            container.register('IDataStore', MockDataStore);
        }
        else if (processor.Provider === 'Custom') {
            container.register('IDataComparator', DataComparator);
            container.register('IDataExtractor', DataExtractor);
            container.register('IDataProcessor', DataProcessorr);
            container.register('IDataStore', DataStore);
        }
    }

}
