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
    EventActionType, 
    ActionOutputParams } from "../../../domain.types/engine/engine.types";
import { Rule } from "./rule.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'rule_actions' })
export class RuleAction {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'enum', enum: EventActionType, nullable: false })
    ActionType : EventActionType;

    @OneToOne(() => Rule, (rule) => rule.Action, { nullable: true, onDelete: 'CASCADE' })
    ParentRule: Rule;

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
