import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToOne,
} from 'typeorm';

import { FileResource } from "./file.resource.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'file_resource_versions' })
export class FileResourceVersion {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @OneToOne(() => FileResource)
    @Column({ type: 'uuid'})
    ResourceId : string;

    @Column({ type: 'uuid', length: 256, nullable: true })
    FileName : string;

    @Column({ type: 'uuid', length: 256, nullable: true })
    OriginalFileName : string;

    @Column({ type: 'varchar', length: 32, nullable: true })
    Version : string;

    @Column({ type: 'varchar', length: 256, nullable: true })
    MimeType : string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    StorageKey : string;

    @Column({ type: 'float', nullable: true })
    SizeInKB : number;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
