import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { Responsible } from "./responsible.entity";
import { StudentClass } from "./student-class.entity";
import { StudentType } from "./student_type.entity";

@Entity()

export class Student extends BaseEntity {

    @PrimaryGeneratedColumn()
    studentId: number;

    @Column({unique: true})
    rollNumber: number

    @Column()
    firstName: string;

    @Column()
    middleName: string;

    @Column()
    lastName: string;

    @Column()
    sex: string;

    @Column()
    dob: Date;

    @Column()
    bob: string;

    @ManyToOne(() => Responsible, responsible => responsible.student)
    @JoinColumn({name:'responsibleid'})
    responsible: Responsible

    @ManyToOne(() => StudentType, studentType => studentType.students)
    @JoinColumn({name: 'studentTypeId'})
    studentType: StudentType;

    @OneToMany(() => StudentClass, studentClass => studentClass.student)
    studentClass: StudentClass[];
}
