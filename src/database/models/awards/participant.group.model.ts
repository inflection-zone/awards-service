import { IsUrl } from "class-validator";
import "reflect-metadata";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Client } from "../client/client.model";
import { Participant } from "./participant.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'participant_groups' })
export class ParticipantGroup {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'varchar', length: 256, nullable: true })
    ReferenceId : string; //This is id of the group in external system

    @ManyToOne(() => Client, { nullable: true })
    @JoinColumn()
    Client : Client;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Name : string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    Description : string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    @IsUrl()
    ImageUrl : string;

    @ManyToMany(() => Participant)
    @JoinTable()
    Participants: Participant[];

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
