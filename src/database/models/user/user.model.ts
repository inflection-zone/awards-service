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
    ManyToMany,
} from 'typeorm';
import { Client } from "../client/client.model";
import { Person } from "./person.model";
import { Role } from "./role.model";

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

    @ManyToMany(() => Role, (role) => role.Users)
    Roles: Role[];

    @Column({ type: 'date', nullable: true })
    LastLogin : Date;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
