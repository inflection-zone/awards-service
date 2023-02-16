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

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'rules' })
export class Rule {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'string', length: 256, nullable: false })
    Name : string;

    @Column({ type: 'string', length: 512, nullable: true })
    Description : string;

    @ManyToOne(() => Node, (node) => node.Rules)
    ParentNode: Node;

    @OneToOne(() => RuleAction, (action) => action.ParentRule)
    @JoinColumn()
    Action: RuleAction;

    @OneToOne(() => Condition, (condition) => condition.Rule)
    @JoinColumn()
    Condition: Condition;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
