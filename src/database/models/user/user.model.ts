import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { Person } from "./person.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'users' })
export class User extends Person {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'string', length: 16, nullable: false })
    Username : string;

    @Column({ type: 'string', length: 1024, nullable: true })
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
