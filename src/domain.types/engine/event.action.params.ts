import { EventActionType } from "./enums";
import { uuid } from "../miscellaneous/system.types";

export interface EventActionParams {
    Message   : string;
    Action    : EventActionType,
    NextNodeId: uuid | undefined;
    Extra?    : any | undefined;
}
