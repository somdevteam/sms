import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "../../student/entities/student.entity";
import { Payment } from "../../../payments/entities/payment.entity";

@Entity()

export class Responsible extends  BaseEntity {
    @PrimaryGeneratedColumn()
    responsibleid: number;
    @Column()
    responsiblename: string;
    @Column()
    phone: string;
    @Column()
    phone2 :string;
    @Column()
    address :string;
    @OneToMany(() => Student, student => student.responsible)
    student: Student[];

    @OneToMany(() => Payment, payment => payment.responsible)
    payment: Payment[];

}
