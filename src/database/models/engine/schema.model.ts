import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    ManyToMany,
    OneToOne,
} from 'typeorm';
import { Client } from "../client/client.model";
import { Node } from "../engine/node.model";
import { IncomingEventType } from "./incoming.event.type.model";
import { SchemaType } from "../../../domain.types/engine/engine.types";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'schema' })
export class Schema {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Name : string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    Description : string;

    @Column({ type: 'enum', enum: SchemaType, nullable: false, default: SchemaType.ReuseExistingInstance })
    Type : SchemaType;

    @ManyToOne(() => Client, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn()
    Client : Client;

    @Column({ type: 'uuid', nullable: true })
    RootNodeId: string;

    @OneToMany(() => Node, (node) => node.Schema, {
        cascade  : true,
    })
    Nodes: Node[];

    @Column({ type: 'date', nullable: true })
    ValidFrom : Date;

    @Column({ type: 'date', nullable: true })
    ValidTill : Date;

    @Column({ type: 'boolean', nullable: false, default: true })
    IsValid : boolean;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
