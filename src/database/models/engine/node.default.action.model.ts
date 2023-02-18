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
import { EventActionType, EventActionTypeList } from "../../../domain.types/engine/enums";
import { Node } from "./node.model";
import { EventActionParams } from "../../../domain.types/engine/event.action.params";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'node_default_actions' })
export class NodeDefaultAction {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'enum', enum: EventActionTypeList, nullable: false })
    ActionType : EventActionType;

    @OneToOne(() => Node, (node) => node.DefaultAction, { nullable: true })
    ParentNode: Node;

    @Column({ type: 'string', length: 256, nullable: false })
    Name : string;

    @Column({ type: 'string', length: 512, nullable: true })
    Description : string;

    @Column({ type: 'simple-json', nullable: true })
    Params : EventActionParams;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
