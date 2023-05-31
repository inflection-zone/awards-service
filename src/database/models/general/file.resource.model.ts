import "reflect-metadata";
import { FileResourceMetadata } from "../../../domain.types/general/file.resource/file.resource.types";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToOne,
} from 'typeorm';

import { User } from './../user/user.model';
import { FileResourceVersion } from "./file.resource.version.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'file_resources' })
export class FileResource {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    OriginalFilename : string;

    @Column({ type: 'varchar', length: 1024, nullable: false })
    StorageKey : string;

    @OneToOne(() => User)
    @Column({ type: 'uuid', nullable: true })
    OwnerUserId : string;

    @OneToOne(() => User)
    @Column({ type: 'uuid', nullable: true })
    UploadedByUserId : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    MimeType : string;

    @Column({ type: 'varchar', length: 256, nullable: true })
    Url : string;

    @Column({ type: 'boolean', nullable: false, default: false })
    Public : boolean;

    @Column({ type: 'integer', nullable: true })
    Size : number;

    @Column({ type: 'integer', nullable: false, default: 0 })
    DownloadCount : number;

    @Column({ type: 'uuid', nullable: true })
    UploadedBy : User;

    @Column({ type: 'simple-json', nullable: true})
    Tags : string[];

    @Column({ type: 'uuid', nullable : true })
    DefaultVersionId: string;

    @Column({ type: 'simple-json', nullable : true })
    DefaultVersion: any;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
