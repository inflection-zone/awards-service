import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { GenderList, Gender } from '../../../domain.types/miscellaneous/system.types';
import { IsEmail, Max, Min , IsUrl } from "class-validator";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'persons' })
export class Person {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'string', length: 256, nullable: false })
    Prefix : string;

    @Column({ type: 'string', length: 256, nullable: false })
    FirstName : string;

    @Column({ type: 'string', length: 256, nullable: false })
    LastName : string;

    @Column({ type: 'string', length: 10, nullable: false, default: '+91' })
    CountryCode : string;

    @Column({ type: 'string', length: 16, nullable: true })
    @Min(6)
    @Max(16)
    Phone : string;

    @Column({ type: 'string', length: 256, nullable: true })
    @IsEmail()
    Email : string;

    @Column({ type: 'enum', enum: GenderList, nullable: false, default: Gender.Unknown })
    Gender : Gender;

    @Column({ type: 'date', nullable: true })
    BirthDate : Date;

    @Column({ type: 'string', length: 1024, nullable: true })
    @IsUrl()
    ProfileImageUrl : string;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
