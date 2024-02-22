import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Responsible} from "../../responsible/entities/responsible.entity";
import {UserEntity} from "../../../user/user.entity";
import {StudentClass} from "../../studentclass/entities/studentclass.entity";

@Entity()

export class Student extends BaseEntity {

    @PrimaryGeneratedColumn()
    studentid: number;
    @Column({unique: true})
    rollNumber: number
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
    responsible: Responsible
    @OneToMany(() => StudentClass, studentClass => studentClass.student)
    studentClass: StudentClass[];
}
