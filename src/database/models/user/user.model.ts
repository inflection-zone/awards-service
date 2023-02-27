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
import { Client } from "../client/client.model";
import { Person } from "../person/person.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'users' })
export class User extends Person {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @ManyToOne(() => Client, { nullable: true })
    @JoinColumn()
    Client : Client;

    @Column({ type: 'varchar', length: 16, nullable: false })
    UserName : string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    Password : string;

    @Column({ type: 'date', nullable: true })
    LastLogin : Date;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
