import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { Gender } from '../../../domain.types/miscellaneous/system.types';
import { IsEmail, Max, Min , IsUrl } from "class-validator";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'persons' })
export class Person {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'varchar', length: 256, nullable: true })
    ReferenceId : string; //This is id of the person in external system

    @Column({ type: 'varchar', length: 256, nullable: true })
    Prefix : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    FirstName : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    LastName : string;

    @Column({ type: 'varchar', length: 10, nullable: false, default: '+91' })
    CountryCode : string;

    @Column({ type: 'varchar', length: 16, nullable: true })
    @Min(6)
    @Max(16)
    Phone : string;

    @Column({ type: 'varchar', length: 256, nullable: true, unique: true })
    @IsEmail()
    Email : string;

    @Column({ type: 'enum', enum: Gender, nullable: false, default: Gender.Unknown })
    Gender : Gender;

    @Column({ type: 'date', nullable: true })
    BirthDate : Date;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    @IsUrl()
    ProfileImageUrl : string;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
