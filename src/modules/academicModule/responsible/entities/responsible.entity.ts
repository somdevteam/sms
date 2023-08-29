import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {OneToMany} from "typeorm/browser";
import {Student} from "../../../studentModule/student/entities/student.entity";

@Entity()

export class Responsible extends  BaseEntity {
    @PrimaryGeneratedColumn()
    responsibleid: number;
    @Column()
    responsiblename: string;
    @Column()
    phone: string;
    @OneToMany(() => Student, student => student.responsible)
    student: Student[];

}
