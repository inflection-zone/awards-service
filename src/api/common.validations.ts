import joi, { object } from 'joi';
import express from 'express';
import {
    ErrorHandler
} from '../common/handlers/error.handler';
import { uuid } from '../domain.types/miscellaneous/system.types';
import { DataActionType, InputSourceType, LogicalOperator, OperandDataType, OutputDestinationType } from '../domain.types/engine/engine.types';

/////////////////////////////////////////////////////////////////////////////

//Create

export const DataExtractionInputParamsObj_Create = joi.object({
    RecordType: joi.string().required(),
    SourceType: joi.string().valid(...Object.values(InputSourceType)).required(),
    InputTag: joi.string().optional(),
    SecondaryInputTag: joi.string().optional(),
    Filters : joi.array().items(joi.object({
        Key  : joi.string(),
        Value: joi.string(),
    })).optional(),
    RecordDateFrom: joi.date().optional(),
    RecordDateTo  : joi.date().optional(),
});

export const DataStorageInputParamsObj_Create = joi.object({
    RecordType: joi.string().required(),
    SourceType: joi.string().valid(...Object.values(InputSourceType)).required(),
    InputTag: joi.string().optional(),
    SecondaryInputTag: joi.string().optional(),
    StorageKeys : joi.array().items(joi.object({
        Key  : joi.string(),
        Value: joi.string(),
    })).optional(),
});

export const ContinuityInputParamsObj_Create = joi.object({
    RecordType: joi.string().required(),
    SourceType: joi.string().valid(...Object.values(InputSourceType)).required(),
    InputTag: joi.string().optional(),
    SecondaryInputTag: joi.string().optional(),
    DataActionType : joi.string().valid(...Object.values(DataActionType)).optional(),
    KeyDataType : joi.string().valid(...Object.values(OperandDataType)).optional(),
    KeyName: joi.string().optional(),
    ValueDataType : joi.string().valid(...Object.values(OperandDataType)).optional(),
    ValueName: joi.string().required(),
    Value: joi.any().optional(),
    SecondaryValue: joi.any().optional(),
    Operator: joi.string().valid(...Object.values(LogicalOperator)).optional(),
    ContinuityCount: joi.number().integer().required(),
});

export const ValueComparisonInputParamsObj_Create = joi.object({
    RecordType: joi.string().required(),
    SourceType: joi.string().valid(...Object.values(InputSourceType)).required(),
    InputTag: joi.string().optional(),
    SecondaryInputTag: joi.string().optional(),
    DataActionType : joi.string().valid(...Object.values(DataActionType)).optional(),
    Filters : joi.array().items(joi.object({
        Key  : joi.string(),
        Value: joi.string(),
    })).optional(),
});

export const RangeComparisonInputParamsObj_Create = joi.object({
    RecordType: joi.string().required(),
    SourceType: joi.string().valid(...Object.values(InputSourceType)).required(),
    InputTag: joi.string().optional(),
    SecondaryInputTag: joi.string().optional(),
    DataActionType : joi.string().valid(...Object.values(DataActionType)).optional(),
    Filters : joi.array().items(joi.object({
        Key  : joi.string(),
        Value: joi.string(),
    })).optional(),
});

export const ActionInputParamsObj_Create = joi.object({
    RecordType: joi.string().required(),
    SourceType: joi.string().valid(...Object.values(InputSourceType)).required(),
    InputTag: joi.string().optional(),
    SecondaryInputTag: joi.string().optional(),
});

export const ActionOutputParamsObj_Create = joi.object({
    DestinationType: joi.string().valid(...Object.values(OutputDestinationType)).required(),
    Message: joi.string().required(),
    OutputTag: joi.string().required(),
    NextNodeId: joi.string().uuid().optional(),
    Extra: joi.any().optional(),
});

/////////////////////////////////////////////////////////////////////////////

//Update

export const DataExtractionInputParamsObj_Update = joi.object({
    RecordType: joi.string().optional(),
    SourceType: joi.string().valid(...Object.values(InputSourceType)).optional(),
    InputTag: joi.string().optional(),
    SecondaryInputTag: joi.string().optional(),
    Filters : joi.array().items(joi.object({
        Key  : joi.string(),
        Value: joi.string(),
    })).optional(),
    RecordDateFrom: joi.date().optional(),
    RecordDateTo  : joi.date().optional(),
});

export const DataStorageInputParamsObj_Update = joi.object({
    RecordType: joi.string().optional(),
    SourceType: joi.string().valid(...Object.values(InputSourceType)).optional(),
    InputTag: joi.string().optional(),
    SecondaryInputTag: joi.string().optional(),
    StorageKeys : joi.array().items(joi.object({
        Key  : joi.string(),
        Value: joi.string(),
    })).optional(),
});

export const ContinuityInputParamsObj_Update = joi.object({
    RecordType: joi.string().optional(),
    SourceType: joi.string().valid(...Object.values(InputSourceType)).optional(),
    InputTag: joi.string().optional(),
    SecondaryInputTag: joi.string().optional(),
    DataActionType : joi.string().valid(...Object.values(DataActionType)).optional(),
    KeyDataType : joi.string().valid(...Object.values(OperandDataType)).optional(),
    KeyName: joi.string().optional(),
    ValueDataType : joi.string().valid(...Object.values(OperandDataType)).optional(),
    ValueName: joi.string().optional(),
    Value: joi.any().optional(),
    SecondaryValue: joi.any().optional(),
    Operator: joi.string().valid(...Object.values(LogicalOperator)).optional(),
    ContinuityCount: joi.number().integer().optional(),
});

export const ValueComparisonInputParamsObj_Update = joi.object({
    RecordType: joi.string().optional(),
    SourceType: joi.string().valid(...Object.values(InputSourceType)).optional(),
    InputTag: joi.string().optional(),
    SecondaryInputTag: joi.string().optional(),
    DataActionType : joi.string().valid(...Object.values(DataActionType)).optional(),
    Filters : joi.array().items(joi.object({
        Key  : joi.string(),
        Value: joi.string(),
    })).optional(),
});

export const RangeComparisonInputParamsObj_Update = joi.object({
    RecordType: joi.string().optional(),
    SourceType: joi.string().valid(...Object.values(InputSourceType)).optional(),
    InputTag: joi.string().optional(),
    SecondaryInputTag: joi.string().optional(),
    DataActionType : joi.string().valid(...Object.values(DataActionType)).optional(),
    Filters : joi.array().items(joi.object({
        Key  : joi.string(),
        Value: joi.string(),
    })).optional(),
});

export const ActionInputParamsObj_Update = joi.object({
    RecordType: joi.string().optional(),
    SourceType: joi.string().valid(...Object.values(InputSourceType)).optional(),
    InputTag: joi.string().optional(),
    SecondaryInputTag: joi.string().optional(),
});

export const ActionOutputParamsObj_Update = joi.object({
    DestinationType: joi.string().valid(...Object.values(OutputDestinationType)).optional(),
    Message: joi.string().optional(),
    OutputTag: joi.string().optional(),
    NextNodeId: joi.string().uuid().optional(),
    Extra: joi.any().optional(),
});

/////////////////////////////////////////////////////////////////////////////
