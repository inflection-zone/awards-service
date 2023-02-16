import "reflect-metadata";
import { LogicalOperator, CompositionOperator, MathematicalOperator, CompositionOperatorList, LogicalOperatorList, MathematicalOperatorList, ConditionOperandDataTypeList, OperandDataType } from "../../../domain.types/engine/enums";
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

    @Column({ type: 'string', length: 256, nullable: false })
    Name : string;

    @OneToOne(() => Rule, (rule) => rule.Condition)
    Rule: Rule;

    @Column({ type: 'boolean', nullable: false, default: false })
    IsComposite : boolean;

    @Column({ type: 'string', length: 256, nullable: true })
    Fact : string;

    @Column({ type: 'enum', enum: [...CompositionOperatorList, ...LogicalOperatorList, ...MathematicalOperatorList], nullable: false })
    Operator : LogicalOperator | MathematicalOperator | CompositionOperator;

    @Column({ type: 'enum', enum: ConditionOperandDataTypeList, nullable: false })
    DataType : OperandDataType;

    @Column({ type: 'json', nullable: true })
    Value : any;

    @ManyToOne(() => Condition, (child) => child.ChildrenConditions)
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
