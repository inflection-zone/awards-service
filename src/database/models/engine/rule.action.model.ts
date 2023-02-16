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
import { EventActionType } from "../../../domain.types/engine/enums";
import { Rule } from "./rule.model";
import { EventActionParams } from "../../../domain.types/engine/event.action.params";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'rule_actions' })
export class RuleAction {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'enum', enum: EventActionType, nullable: false })
    ActionType : EventActionType;

    @OneToOne(() => Rule, (rule) => rule.Action, { nullable: true })
    ParentRule: Rule;

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
