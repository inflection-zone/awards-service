import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { IncomingEventType } from "./incoming.event.type.model";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { Context } from "./context.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'incoming_events' })
export class IncomingEvent {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @ManyToOne(() => IncomingEventType)
    @JoinColumn()
    EventType: IncomingEventType;

    @ManyToOne(() => Context)
    Context: Context;

    @Column({ type: 'uuid', nullable: true })
    ReferenceId: uuid;

    @Column({ type: 'simple-json', nullable: true })
    Payload: any;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
