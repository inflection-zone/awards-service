import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Condition } from "./condition.model";
import { RuleAction } from "./rule.action.model";
import { Node } from "./node.model";
import { Schema } from "./schema.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'rules' })
export class Rule {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Name : string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    Description : string;

    @ManyToOne(() => Node, (node) => node.Rules, { onDelete: 'CASCADE' })
    @JoinColumn()
    ParentNode: Node;

    @ManyToOne(() => Schema, (schema) => schema.Nodes)
    Schema: Schema;

    @OneToOne(() => RuleAction, (action) => action.ParentRule, { cascade: true })
    @JoinColumn()
    Action: RuleAction;

    @OneToOne(() => Condition, (condition) => condition.Rule, { nullable: true, cascade: true })
    @JoinColumn()
    Condition: Condition;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
