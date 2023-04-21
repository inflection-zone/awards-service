import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Schema } from '../engine/schema.model';
import { SchemaInstance } from '../engine/schema.instance.model';
import { Context } from "../engine/context.model";
import { NodeInstance } from "../engine/node.instance.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'disbursed_award_points' })
export class DisbursedAwardPoint {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @ManyToOne(()=> Context)
    @JoinColumn()
    Context : Context;

    @ManyToOne(()=> Schema)
    @JoinColumn()
    Schema : Schema;

    @ManyToOne(()=> SchemaInstance)
    @JoinColumn()
    SchemaInstance : SchemaInstance;

    @ManyToOne(()=> NodeInstance)
    @JoinColumn()
    ExecutedNodeInstance : NodeInstance;

    @Column({ type: 'date', nullable: false })
    AwardedDate : Date;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Message : string;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
