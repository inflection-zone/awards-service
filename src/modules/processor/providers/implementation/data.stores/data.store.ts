import { uuid } from "../../../../../domain.types/miscellaneous/system.types";
import { IDataStore } from "../../../interfaces/data.store.interface";
import { DeleteResult, Repository } from "typeorm";
import { FactsSource } from '../../../../fact.extractors/facts.db.connector';
import { Source } from '../../../../../database/database.connector';
import { MedicationFact } from '../../../../fact.extractors/models/medication.fact.model';
import { BadgeFact } from '../../../../fact.extractors/models/bedge.facts.model';
import { Context } from "../../../../../database/models/engine/context.model";
import { logger } from "../../../../../logger/logger";
import { ErrorHandler } from "../../../../../common/handlers/error.handler";
import { ParticipantBadge } from "../../../../../database/models/awards/participant.badge.model";
import { DataStorageInputParams, OutputParams, ProcessorResult } from '../../../../../domain.types/engine/engine.types';
import { Badge } from "../../../../../database/models/awards/badge.model";
import { Participant } from "../../../../../database/models/awards/participant.model";

//////////////////////////////////////////////////////////////////////

export class DataStore implements IDataStore {

    //#region Repositories

    _medicationRepository: Repository<MedicationFact> = FactsSource.getRepository(MedicationFact);

    _badgeFactRepository: Repository<BadgeFact> = FactsSource.getRepository(BadgeFact);

    _badgeRepository: Repository<Badge> = Source.getRepository(Badge);

    _participantBadgeRepository: Repository<ParticipantBadge> = Source.getRepository(ParticipantBadge);

    _participantRepository: Repository<Participant> = Source.getRepository(Participant);

    _contextRepository: Repository<Context> = Source.getRepository(Context);

    //#endregion

    storeData = async (
        contextId: uuid, 
        records:any[], 
        inputParams: DataStorageInputParams, 
        outputParams: OutputParams): Promise<ProcessorResult> => {

        const context = await this.getContextById(contextId);
        const recordType = inputParams.RecordType;
        if (recordType === 'Badge') {
            return await this.storeBadgeData(context, records, inputParams, outputParams.OutputTag);   
        }
        ErrorHandler.throwNotFoundError(`Data store not found for record type.`);
    };

    removeData = async (
        contextId: uuid, 
        records:any[], 
        inputParams: DataStorageInputParams, 
        outputParams: OutputParams): Promise<ProcessorResult> => {

        const context = await this.getContextById(contextId);
        const recordType = inputParams.RecordType;
        if (recordType === 'Badge') {
            return await this.removeBadgeData(context, records, inputParams, outputParams.OutputTag);   
        }
        ErrorHandler.throwNotFoundError(`Data store not found for record type.`);
    };

    private storeBadgeData = async (
        context: Context, 
        records: any[], 
        inputParams: DataStorageInputParams, 
        tag: string) => {

        const storageKeys = inputParams.StorageKeys;
        if (!storageKeys && storageKeys.length === 0) {
            throw new Error(`Empty storage keys!`);
        }
        const x = storageKeys.find(x => x.Key === 'BadgeId');
        if (!x) {
            throw new Error(`Badge not found to add badge for the participant!`);
        }
        const badgeId = x.Value;
        if (!badgeId) {
            throw new Error(`Invalid badge Id!`);
        }
        const participant = await this._participantRepository.findOne({
            where: {
                ReferenceId : context.ReferenceId
            }
        });
        const badge = await this._badgeRepository.findOne({
            where: {
                id : badgeId
            }
        });

        const addedBadges = [];
        for await (var r of records) {
            const start = (new Date(r.start)).toISOString().split('T')[0];
            const end = (new Date(r.end)).toISOString().split('T')[0];
            const metadata = {
                start : start,
                end : end,
                key : `(${start})-(${end})`,
            };
            const str = JSON.stringify(metadata);
            const record = await this._participantBadgeRepository.create({
                Participant: participant,
                Badge: badge,
                Reason: badge.Description,
                AcquiredDate: new Date(end),
                Metadata: str
            });
            const record_ = await this._participantBadgeRepository.save(record);
            addedBadges.push(record_);
        }
        
        const result: ProcessorResult = {
            Success: true,
            Tag    : tag,
            Data   : addedBadges
        };

        return result;
    };

    private removeBadgeData = async (
        context: Context, 
        records: any[], 
        inputParams: DataStorageInputParams, 
        tag: string) => {

        const recordIds = records.map(x => x.id);
        var deleted: DeleteResult = null;
        if (recordIds && recordIds.length > 0) {
            deleted = await this._participantBadgeRepository.delete(recordIds);
        }

        const result: ProcessorResult = {
            Success: true,
            Tag    : tag,
            Data   : deleted
        };

        return result;
    };

    public getContextById = async (id: uuid): Promise<Context> => {
        try {
            var context = await this._contextRepository.findOne({
                where : {
                    id : id
                },
                relations: {
                    Participant: true,
                    Group: true,
                }
            });
            return context;
        } catch (error) {
            logger.error(error.message);
        }
    };

}