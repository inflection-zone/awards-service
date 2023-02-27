import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { NodeDefaultAction } from "./node.default.action.model";
import { Rule } from "./rule.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'nodes' })
export class Node {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Name : string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    Description : string;

    @Column({ type: 'uuid', nullable: true })
    SchemaId: string;

    @OneToMany(() => Rule, (rule) => rule.ParentNode, {
        cascade  : true,
        nullable : true,
    })
    @JoinColumn()
    Rules: Rule[];

    @OneToOne(() => NodeDefaultAction, (action) => action.ParentNode)
    @JoinColumn()
    DefaultAction: NodeDefaultAction;

}
