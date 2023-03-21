import "reflect-metadata";
import { ExecutionStatus } from "../../../domain.types/engine/enums";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
} from 'typeorm';
import { Rule } from "./rule.model";
import { Node } from './node.model';

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'node_instances' })
export class NodeInstance extends Node {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Name : string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    Description : string;

    @Column({ type: 'enum', enum: ExecutionStatus, nullable: false, default: ExecutionStatus.Pending })
    ExecutionStatus : ExecutionStatus;

    @Column({ type: 'uuid', nullable: false })
    NodeId: string;

    @Column({ type: 'uuid', nullable: false })
    ContextId: string;

    @Column({ type: 'timestamp', nullable: true })
    StatusUpdateTimestamp : Date;

    @OneToOne(() => Rule, { nullable: true })
    ApplicableRule: Rule;

    @Column({ type: 'simple-json', nullable: true })
    AvailableFacts : any[];

    @Column({ type: 'boolean', nullable: false, default: false })
    ExecutedDefaultAction: boolean;

    @Column({ type: 'simple-json', nullable: true })
    ExecutionResult : any;

}
