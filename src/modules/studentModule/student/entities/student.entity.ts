import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Responsible} from "../../responsible/entities/responsible.entity";
import {UserEntity} from "../../../user/user.entity";
import {StudentClass} from "../../studentclass/entities/studentclass.entity";
import { Payment } from "../../../payments/entities/payment.entity";

@Entity()
export class Student extends BaseEntity {
    @PrimaryGeneratedColumn()
    studentid: number;

    @Column({unique: true, nullable: true})
    rollNumber: number;

    @Column({nullable: false})
    firstname: string;

    @Column({nullable: true})
    middlename: string;

    @Column({nullable: false})
    lastname: string;

    @Column({nullable: false})
    Sex: string;

    @Column({nullable: false})
    dob: Date;

    @Column({nullable: true})
    bob: string;

    @Column({ default: true, nullable: false })
    isActive: boolean;

    @ManyToOne(() => Responsible, responsible => responsible.student)
    @JoinColumn({name:'responsibleid'})
    responsible: Responsible;

    @OneToMany(() => StudentClass, studentClass => studentClass.student)
    studentClass: StudentClass[];

    @OneToMany(()=>Payment,payment =>payment.student)
    payment: Payment;
}
