import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { NodeDefaultAction } from "./node.default.action.model";
import { Rule } from "./rule.model";
import { Schema } from "./schema.model";
import { NodeType } from "../../../domain.types/engine/engine.types";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'nodes' })
export class Node {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'enum', enum: NodeType, nullable: false, default: NodeType.ExecutionNode })
    Type : NodeType;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Name : string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    Description : string;

    @ManyToOne(() => Node, (node) => node.Children)
    ParentNode: Node;

    @OneToMany(() => Node, (node) => node.ParentNode)
    Children: Node[];

    @ManyToOne(() => Schema, (schema) => schema.Nodes, { onDelete: 'CASCADE' })
    @JoinColumn()
    Schema: Schema;

    @OneToMany(() => Rule, (rule) => rule.ParentNode, {
        cascade  : true,
        nullable : true,
    })
    Rules: Rule[];

    @OneToOne(() => NodeDefaultAction, (action) => action.ParentNode, { onDelete: 'CASCADE' })
    @JoinColumn()
    Action: NodeDefaultAction;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
