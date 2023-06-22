import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToMany,
} from 'typeorm';
import { Role } from "../user/role.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'privileges' })
export class Privilege {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'varchar', length: 32, nullable: false, unique: true })
    Name : string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    Description : string;

    @ManyToMany(() => Role, (role) => role.Privileges)
    Roles: Role[];

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
