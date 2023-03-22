import "reflect-metadata";
import {
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Schema } from "./schema.model";
import { NodeInstance } from "./node.instance.model";
import { Context } from "./context.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'schema_instances' })
export class SchemaInstance {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @ManyToOne(() => Schema)
    @JoinColumn()
    Schema: Schema;

    @ManyToOne(() => Context)
    @JoinColumn()
    Context: Context;

    @OneToMany(() => NodeInstance, (nodeInstance) => nodeInstance.SchemaInstance)
    NodeInstances : NodeInstance[];

    @OneToOne(() => NodeInstance)
    RootNodeInstance: NodeInstance;

    @OneToOne(() => NodeInstance)
    CurrentNodeInstance: NodeInstance;

}
