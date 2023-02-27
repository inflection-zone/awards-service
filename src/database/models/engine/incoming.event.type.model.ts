import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { IncomingEvent } from "./incoming.event.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'incoming_event_types' })
export class IncomingEventType {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Name : string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    Description : string;

    @OneToMany(() => IncomingEvent, (event) => event.EventType, {
        cascade : true,
    })
    @JoinColumn()
    Events: IncomingEvent[];

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
