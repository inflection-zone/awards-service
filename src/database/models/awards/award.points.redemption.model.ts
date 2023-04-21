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
import { Context } from "../engine/context.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'award_points_redemptions' })
export class AwardPointRedemption {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @ManyToOne(()=> Context)
    @JoinColumn()
    Context : Context;

    @Column({ type: 'integer', nullable: false, default: 0 })
    RedeemedPoints : number;

    @Column({ type: 'varchar', length: 512, nullable: false })
    Purpose : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Message : string;

    @Column({ type: 'date', nullable: false })
    RedemptionDate : Date;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
