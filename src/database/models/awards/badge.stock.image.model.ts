import { IsUUID } from "class-validator";
import "reflect-metadata";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'badge_stock_images' })
export class BadgeStockImage {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ type: 'varchar', length: 64, nullable: true })
    Code : string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    FileName : string;

    @Column({ type: 'uuid', nullable: true })
    @IsUUID()
    ResourceId : string;

    @Column({ type: 'varchar', length: 2048, nullable: true })
    PublicUrl: string;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
