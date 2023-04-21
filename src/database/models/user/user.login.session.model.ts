import { IsDate } from "class-validator";
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
import { User } from "./user.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'user_login_sessions' })
export class UserLoginSession {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn()
    User: User;

    @Column({ type: 'boolean', nullable: false, default: true })
    IsActive: boolean;

    @Column({ type: 'date', nullable: true })
    @IsDate()
    StartedAt : Date;

    @Column({ type: 'date', nullable: true })
    @IsDate()
    ValidTill : Date;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
