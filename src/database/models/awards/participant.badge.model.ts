import "reflect-metadata";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Participant } from "../awards/participant.model";
import { Badge } from "./badge.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'participant_badges' })
export class ParticipantBadge {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @ManyToOne(() => Participant, { nullable: false })
    @JoinColumn()
    Participant : Participant;

    @ManyToOne(() => Badge, { nullable: false })
    @JoinColumn()
    Badge : Badge;

    @Column({ type: 'varchar', length: 512, nullable: true })
    Reason : string;

    @Column({ type: 'simple-json', nullable: true })
    Metadata : string;

    @Column({ type: 'date', nullable: true })
    AcquiredDate : Date;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
