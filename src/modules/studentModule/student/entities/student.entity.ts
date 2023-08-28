import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Responsible} from "../../../academicModule/responsible/entities/responsible.entity";

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
    @OneToMany(() => Responsible, responsible => responsible.responsibleid)
    responsible: Responsible[]

}
