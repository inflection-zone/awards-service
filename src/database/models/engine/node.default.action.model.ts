import "reflect-metadata";
import {
    Column,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { 
    ActionInputParams, 
    EventActionType } from "../../../domain.types/engine/engine.types";
import { Node } from "./node.model";
import { ActionOutputParams } from "../../../domain.types/engine/engine.types";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'node_default_actions' })
export class NodeDefaultAction {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'enum', enum: EventActionType, nullable: false })
    ActionType : EventActionType;

    @OneToOne(() => Node, (node) => node.Action, { nullable: true })
    ParentNode: Node;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Name : string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    Description : string;

    @Column({ type: 'simple-json', nullable: true })
    InputParams : ActionInputParams;

    @Column({ type: 'simple-json', nullable: true })
    OutputParams : ActionOutputParams;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
