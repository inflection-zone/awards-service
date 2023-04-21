import "reflect-metadata";
import {
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Schema } from "./schema.model";
import { IncomingEventType } from "./incoming.event.type.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'schema_event_types' })
export class SchemaEventType {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @ManyToOne(() => Schema, { onDelete: 'CASCADE' })
    @JoinColumn()
    Schema: Schema;

    @ManyToOne(() => IncomingEventType)
    @JoinColumn()
    EventType: IncomingEventType;
}
