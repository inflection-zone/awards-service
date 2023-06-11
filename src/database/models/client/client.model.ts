import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Participant } from "../awards/participant.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'clients' })
export class Client {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Name : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Code : string;

    @Column({ type: 'varchar', length: 10, nullable: false, default: '+91' })
    CountryCode : string;

    @Column({ type: 'varchar', length: 16, nullable: true })
    Phone : string;

    @Column({ type: 'varchar', length: 256, nullable: true })
    @IsEmail()
    Email : string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    Password : string;

    @Column({ type: 'boolean', nullable: false, default: false })
    IsPrivileged : boolean;

    @Column({ type: 'varchar', length: 256, nullable: false })
    ApiKey : string;

    @Column({ type: 'date', nullable: true })
    ValidFrom : Date;

    @Column({ type: 'date', nullable: true })
    ValidTill : Date;

    @OneToMany(() => Participant, (participant) => participant.Client)
    Participants: Participant[];

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
