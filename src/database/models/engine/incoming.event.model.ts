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

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'incoming_events' })
export class IncomingEvent {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'string', length: 256, nullable: false })
    Name : string;

    @ManyToOne(() => IncomingEventType, (EventType) => EventType.Events)
    @JoinColumn()
    EventType: IncomingEventType;

    @Column({ type: 'uuid', nullable: false })
    ContextId: string; //ContextId in most cases is userId

    @Column({ type: 'uuid', nullable: true })
    SchemaId: string;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
