import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Responsible} from "../../../academicModule/responsible/entities/responsible.entity";
import {UserEntity} from "../../../user/user.entity";

@Entity()

export class Student extends BaseEntity {

    @PrimaryGeneratedColumn()
    studentid: number;
    @Column()
    firstname: string;
    @Column()
    middlename: string;
    @Column()
    lastname: string;
    @Column()
    Sex: string;
    @Column()
    dob: Date;
    @Column()
    bob: string;
    @ManyToOne(() => Responsible, responsible => responsible.student)
    @JoinColumn({name:'responsibleid'})
    responsible: Responsible[]
}
