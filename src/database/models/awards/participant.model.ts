import "reflect-metadata";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from "../client/client.model";
import { Person } from "../user/person.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'participants' })
export class Participant extends Person {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @ManyToOne(() => Client, { nullable: true })
    @JoinColumn()
    Client : Client;

    @Column({ type: 'date', nullable: true })
    OnboardingDate : Date;

}
