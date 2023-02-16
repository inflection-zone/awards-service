import "reflect-metadata";
import {
    Column,
    Entity,
    OneToOne,
} from 'typeorm';
import { Schema } from "./schema.model";
import { NodeInstance } from "./node.instance.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'schema_instances' })
export class SchemaInstance extends Schema {

    @Column({ type: 'uuid', nullable: false })
    SchemaId: string;

    @Column({ type: 'uuid', nullable: false })
    ContextId: string;

    @OneToOne(() => NodeInstance)
    RootNodeInstance: NodeInstance;

    @OneToOne(() => NodeInstance)
    CurrentNodeInstance: NodeInstance;

}
