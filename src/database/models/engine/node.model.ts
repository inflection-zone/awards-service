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

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'nodes' })
export class Node {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Name : string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    Description : string;

    @ManyToOne(() => Node, (node) => node.Children)
    ParentNode: Node;

    @OneToMany(() => Node, (node) => node.ParentNode)
    Children: Node[];

    @ManyToOne(() => Schema, (schema) => schema.Nodes)
    Schema: Schema;

    @OneToMany(() => Rule, (rule) => rule.ParentNode, {
        cascade  : true,
        nullable : true,
    })
    @JoinColumn()
    Rules: Rule[];

    @OneToOne(() => NodeDefaultAction, (action) => action.ParentNode)
    @JoinColumn()
    DefaultAction: NodeDefaultAction;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
