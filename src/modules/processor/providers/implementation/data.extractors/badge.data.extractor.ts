import { Repository } from "typeorm";
import { FactsSource } from '../../../../fact.extractors/facts.db.connector';
import { Source } from '../../../../../database/database.connector';
import { MedicationFact } from '../../../../fact.extractors/models/medication.fact.model';
import { BadgeFact } from '../../../../fact.extractors/models/bedge.facts.model';
import { Context } from "../../../../../database/models/engine/context.model";
import { ParticipantBadge } from "../../../../../database/models/awards/participant.badge.model";
import { DataExtractionInputParams, OutputParams, ProcessorResult } from '../../../../../domain.types/engine/engine.types';
import { IExtractor } from "./extractor.interface";

//////////////////////////////////////////////////////////////////////

export class BadgeDataExtractor  implements IExtractor {

    //#region Repositories

    _medicationRepository: Repository<MedicationFact> = FactsSource.getRepository(MedicationFact);

    _badgeRepository: Repository<BadgeFact> = FactsSource.getRepository(BadgeFact);

    _participantBadgeRepository: Repository<ParticipantBadge> = Source.getRepository(ParticipantBadge);

    _contextRepository: Repository<Context> = Source.getRepository(Context);

    //#endregion
    
    public extract = async (
        context: Context,
        inputParams: DataExtractionInputParams,
        outputParams: OutputParams) => {

        const filters = {};
        filters['RecordType'] = inputParams.RecordType;
        if (inputParams.Filters) {
            for (var f of inputParams.Filters) {
                filters[f.Key] = f.Value;
            }
        }

        const records = await this._participantBadgeRepository.find({
            where : {
                Participant : {
                    ReferenceId : context.ReferenceId
                },
                Badge : {
                    Name     : filters['BadgeTitle'],
                    Category : {
                        Name : filters['BadgeCategory']
                    }
                }
            },
            select : {
                id           : true,
                AcquiredDate : true,
                Badge        : {
                    id       : true,
                    Category : {
                        id          : true,
                        Name        : true,
                        Description : true,
                    },
                    Name        : true,
                    Description : true,
                    ImageUrl    : true,
                },
                Participant : {
                    id          : true,
                    ReferenceId : true,
                },
                Metadata : true,
            },
            relations : {
                Participant : true,
                Badge       : {
                    Category : true,
                }
            }
        });

        var refined = [];
        for (var r of records) {
            var metadata = JSON.parse(r.Metadata);
            var id = r.id;
            var start = (new Date(metadata.start)).toISOString().split('T')[0];
            var end = (new Date(metadata.end)).toISOString().split('T')[0];
            var key = `(${start})-(${end})`; //-(${r.Badge.Name})
            refined.push({ id, start, end, key });
        }
        
        const result: ProcessorResult = {
            Success : true,
            Tag     : outputParams.OutputTag,
            Data    : refined
        };

        return result;
    };

}
