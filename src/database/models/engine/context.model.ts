import "reflect-metadata";
import { ContextType } from "../../../domain.types/engine/engine.types";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Participant } from "../awards/participant.model";
import { ParticipantGroup } from "../awards/participant.group.model";
import { SchemaInstance } from "./schema.instance.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'contexts' })
export class Context {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'enum', enum: ContextType, nullable: false, default: ContextType.Person })
    Type : ContextType;

    @Column({ type: 'uuid', nullable: true })
    ReferenceId : string;

    @OneToOne(() => Participant, { nullable: true })
    @JoinColumn()
    Participant: Participant;

    @OneToOne(() => ParticipantGroup, { nullable: true })
    @JoinColumn()
    Group: ParticipantGroup;

    @OneToMany(() => SchemaInstance, (schemaInstance) => schemaInstance.Context, {
        cascade  : true,
        nullable : true,
    })
    @JoinColumn()
    SchemaInstances: SchemaInstance[];

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
