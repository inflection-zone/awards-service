import "reflect-metadata";
import { ExecutionStatus } from "../../../domain.types/engine/enums";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Rule } from "./rule.model";
import { Node } from './node.model';
import { Context } from "./context.model";
import { SchemaInstance } from "./schema.instance.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'node_instances' })
export class NodeInstance {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @ManyToOne(() => Node)
    @JoinColumn()
    Node: Node;

    @ManyToOne(() => SchemaInstance, (schemaInstance) => schemaInstance.NodeInstances)
    SchemaInstance: SchemaInstance;

    @ManyToOne(() => NodeInstance, (parentNodeInstance) => parentNodeInstance.ChildrenNodeInstances)
    ParentNodeInstance: NodeInstance;

    @OneToMany(() => NodeInstance, (childNodeInstance) => childNodeInstance.ParentNodeInstance)
    ChildrenNodeInstances: NodeInstance[];

    @Column({ type: 'enum', enum: ExecutionStatus, nullable: false, default: ExecutionStatus.Pending })
    ExecutionStatus : ExecutionStatus;

    @ManyToOne(() => Context)
    Context: Context;

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
