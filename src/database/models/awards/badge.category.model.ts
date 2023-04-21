import { IsUrl } from "class-validator";
import "reflect-metadata";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Client } from "../client/client.model";
import { Badge } from "./badge.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'badge_categories' })
export class BadgeCategory {

    @PrimaryGeneratedColumn('uuid')
    id : string;

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

    @OneToMany(() => Badge, (badge)=> badge.Category)
    Badges: Badge[];

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
