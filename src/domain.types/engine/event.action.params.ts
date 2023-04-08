import { uuid } from "../miscellaneous/system.types";

export interface EventActionParams {
    Message    : string;
    NextNodeId?: uuid | undefined;
    Extra?     : any | undefined;
}
