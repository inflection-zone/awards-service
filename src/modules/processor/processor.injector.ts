import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { DataComparator } from './providers/implementation/data.comparator';
import { DataExtractor } from './providers/implementation/data.extractor';
import { DataProcessorr } from './providers/implementation/data.processor';
import { MockDataComparator } from './providers/mock/mock.data.comparator';
import { MockDataExtractor } from './providers/mock/mock.data.extractor';
import { MockDataProcessorr } from './providers/mock/mock.data.processor';
import { ConfigurationManager } from '../../config/configuration.manager';

////////////////////////////////////////////////////////////////////////////////

export class ProcessorsInjector {

    static registerInjections(container: DependencyContainer) {

        const processor = ConfigurationManager.Processor;
        if (processor.Provider === 'Mock') {
            container.register('IDataComparator', MockDataComparator);
            container.register('IDataExtractor', MockDataExtractor);
            container.register('IDataProcessor', MockDataProcessorr);
        }
        else if (processor.Provider === 'Custom') {
            container.register('IDataComparator', DataComparator);
            container.register('IDataExtractor', DataExtractor);
            container.register('IDataProcessor', DataProcessorr);
        }
    }

}
