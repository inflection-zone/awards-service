import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'file_resources' })
export class FileResource {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'string', length: 1024, nullable: false })
    StorageKey : string;

    @Column({ type: 'string', length: 256, nullable: false })
    OriginalFilename : string;

    @Column({ type: 'string', length: 256, nullable: false })
    MimeType : string;

    @Column({ type: 'boolean', nullable: false, default: false })
    Public : boolean;

    @Column({ type: 'integer', nullable: true })
    Size : number;

    @Column({ type: 'integer', nullable: false, default: 0 })
    DownloadCount : number;

    @Column({ type: 'uuid', nullable: true })
    UploadedBy : string;

    @Column('simple_array')
    Tags : string[];

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
