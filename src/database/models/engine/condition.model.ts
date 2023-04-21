import "reflect-metadata";
import { LogicalOperator, CompositionOperator, MathematicalOperator, OperandDataType, OperatorType } from "../../../domain.types/engine/engine.types";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    OneToOne,
    ManyToOne,
} from 'typeorm';
import { Rule } from "./rule.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'conditions' })
export class Condition {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Name : string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    Description : string;

    @OneToOne(() => Rule, (rule) => rule.Condition)
    Rule: Rule;

    @Column({ type: 'enum', enum: OperatorType, nullable: false, default: OperatorType.Logical })
    Operator : OperatorType;

    @Column({ type: 'varchar', length: 256, nullable: true })
    Fact : string;

    @Column({ type: 'enum', enum: LogicalOperator, nullable: false, default: LogicalOperator.None })
    LogicalOperator : LogicalOperator;

    @Column({ type: 'enum', enum: MathematicalOperator, nullable: false, default: MathematicalOperator.None })
    MathematicalOperator : MathematicalOperator;

    @Column({ type: 'enum', enum: CompositionOperator, nullable: false, default: CompositionOperator.None })
    CompositionOperator : CompositionOperator;

    @Column({ type: 'enum', enum: OperandDataType, nullable: false })
    DataType : OperandDataType;

    @Column({ type: 'json', nullable: true })
    Value : any;

    @ManyToOne(() => Condition, (child) => child.ChildrenConditions, { nullable: true })
    ParentCondition: Condition;

    @OneToMany(() => Condition, (parent) => parent.ParentCondition)
    ChildrenConditions: Condition[];

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
