import "reflect-metadata";
import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
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
    @JoinColumn()
    RootNodeInstance: NodeInstance;

    @OneToOne(() => NodeInstance)
    @JoinColumn()
    CurrentNodeInstance: NodeInstance;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
