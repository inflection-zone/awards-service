import { IsUrl } from "class-validator";
import "reflect-metadata";
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from "../client/client.model";
import { Participant } from "./participant.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'groups' })
export class Group {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @ManyToOne(() => Client, { nullable: true })
    @JoinColumn()
    Client : Client;

    @Column({ type: 'string', length: 256, nullable: false })
    Name : string;

    @Column({ type: 'string', length: 512, nullable: true })
    Description : string;

    @Column({ type: 'string', length: 1024, nullable: true })
    @IsUrl()
    ProfileImageUrl : string;

    @ManyToMany(() => Participant)
    @JoinTable()
    Participants: Participant[];

}
