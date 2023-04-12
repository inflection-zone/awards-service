import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { IDataExtractor } from "../../interfaces/data.extractor.interface";
import { Repository } from "typeorm";
import { FactsSource } from '../../../fact.extractors/facts.db.connector';
import { Source } from '../../../../database/database.connector';
import { MedicationFact } from '../../../fact.extractors/models/medication.fact.model';
import { BadgeFact } from '../../../fact.extractors/models/bedge.facts.model';
import { Context } from "../../../../database/models/engine/context.model";
import { logger } from "../../../../logger/logger";
import { ErrorHandler } from "../../../../common/handlers/error.handler";
import { ParticipantBadge } from "../../../../database/models/awards/participant.badge.model";
import { ProcessorResult } from '../../../../domain.types/engine/engine.enums';

//////////////////////////////////////////////////////////////////////

export class DataExtractor implements IDataExtractor {

    //#region Repositories

    _medicationRepository: Repository<MedicationFact> = FactsSource.getRepository(MedicationFact);

    _badgeRepository: Repository<BadgeFact> = FactsSource.getRepository(BadgeFact);

    _participantBadgeRepository: Repository<ParticipantBadge> = Source.getRepository(ParticipantBadge);

    _contextRepository: Repository<Context> = Source.getRepository(Context);

    //#endregion

    extractData = async (contextId: uuid, subject: any): Promise<ProcessorResult> => {
        const context = await this.getContextById(contextId);
        const recordType = subject.RecordType;

        if (recordType === 'Medication') {
            return await this.extractMedicationData(context, subject);            
        }
        else if (recordType === 'Badge') {
            const filters = {
                RecordType   : recordType,
                BadgeCategory: subject.BadgeCategory,
                BadgeName    : subject.BadgeName,
            };
            return await this.extractBadgeData(context, filters);   
        }

        ErrorHandler.throwNotFoundError(`Data extractor not found for record type.`);
    };

    //#region Private methods

    public getContextById = async (id: uuid): Promise<Context> => {
        try {
            var context = await this._contextRepository.findOne({
                where : {
                    id : id
                },
            });
            return context;
        } catch (error) {
            logger.error(error.message);
        }
    };

    private extractMedicationData = async (context: Context, filters: any) => {

        const records = await this._medicationRepository.find({
            where: {
                ContextReferenceId: context.ReferenceId
            },
            
        });
        // const filtered = records.filter(x => x.Taken === false);
        // const transformed = filtered.map(x => {
        //     return {
        //         MedicationId : x.MedicationId,
        //         RecordDate : new Date(x.RecrodDateStr)
        //     };
        // });
        // return transformed;

        const records_ = await this._medicationRepository
            .createQueryBuilder()
            .select('med')
            .from(MedicationFact, 'med')
            .where("med.ContextReferenceId = :id", { id: context.ReferenceId })
            .groupBy('med.RecrodDateStr')
            .getManyAndCount();

        // const transformed = records.map(x => {
        //     return {
        //         MedicationId: x.MedicationId,
        //         RecordDate: new Date(x.RecrodDateStr)
        //     };
        // });

        const result: ProcessorResult = {
            Success: true,
            Tag    : [filters.RecordType].join(':'),
            Data   : records
        };

        return result;
    };

    private extractBadgeData = async (context: Context, filters: any) => {

        const records = await this._participantBadgeRepository.find({
            where: {
                Participant: {
                    ReferenceId : context.ReferenceId
                },
                Badge: {
                    Name    : filters.BadgeName,
                    Category: {
                        Name : filters.BadgeCategory
                    }
                }
            },
            select : {
                id          : true,
                AcquiredDate: true,
                Badge       : {
                    id      : true,
                    Category: {
                        id         : true,
                        Name       : true,
                        Description: true,
                    },
                    Name       : true,
                    Description: true,
                    ImageUrl   : true,
                },
                Participant: {
                    id         : true,
                    ReferenceId: true,
                },
            },
            relations: {
                Participant: true,
                Badge: {
                    Category: true,
                }
            }
        });

        
        const result: ProcessorResult = {
            Success: true,
            Tag    : [filters.RecordType, filters.BadgeCategory, filters.BadgeName].join(':'),
            Data   : records
        };

        return result;
    };

    //#endregion

}
