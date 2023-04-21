import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinTable,
    ManyToMany,
} from 'typeorm';
import { User } from "../user/user.model";
import { Privilege } from "../user/privilege.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'roles' })
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 32, nullable: false, unique: true })
    Name : string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    Description : string;

    @ManyToMany(() => User, (user) => user.Roles)
    @JoinTable()
    Users: User[];

    @ManyToMany(() => Privilege, (privilege) => privilege.Roles)
    @JoinTable()
    Privileges: Privilege[];

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
