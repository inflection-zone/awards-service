import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';

import { User } from './../user/user.model';

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'file_resources' })
export class FileResource {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'varchar', length: 1024, nullable: false })
    StorageKey : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    OriginalFilename : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    MimeType : string;

    @Column({ type: 'boolean', nullable: false, default: false })
    Public : boolean;

    @Column({ type: 'integer', nullable: true })
    Size : number;

    @Column({ type: 'integer', nullable: false, default: 0 })
    DownloadCount : number;

    @Column({ type: 'uuid', nullable: true })
    UploadedBy : User;

    @Column('simple-json')
    Tags : string[];

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
