import { IsUrl } from "class-validator";
import "reflect-metadata";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Client } from "../client/client.model";
import { BadgeCategory } from "./badge.category.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'badges' })
export class Badge {

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
    ImageUrl : string;

    @ManyToOne(() => BadgeCategory)
    @JoinTable()
    Category: BadgeCategory;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
