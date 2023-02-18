import "reflect-metadata";
import { ContextType, ContextTypeList } from "../../../domain.types/engine/enums";
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Participant } from "../awards/participant.model";
import { Group } from "../awards/group.model";

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'contexts' })
export class Context {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'enum', enum: ContextTypeList, nullable: false, default: ContextType.Person })
    Type : ContextType;

    @Column({ type: 'uuid', nullable: true })
    ReferenceId : string;

    @OneToOne(() => Participant, { nullable: true })
    @JoinColumn()
    Participant: Participant;

    @OneToOne(() => Group, { nullable: true })
    @JoinColumn()
    Group: Group;

}
