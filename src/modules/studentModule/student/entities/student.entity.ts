import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { StudentClass } from "./student-class.entity";
import { StudentType } from "./student_type.entity";
import { Guardian } from "./guardian.entity";

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

    @ManyToOne(() => Guardian, guardian => guardian.student, {nullable: true})
    @JoinColumn({name:'guardianId'})
    guardian: Guardian

    @ManyToOne(() => StudentType, studentType => studentType.students, {nullable: true})
    @JoinColumn({name: 'studentTypeId'})
    studentType: StudentType;

    @OneToMany(() => StudentClass, studentClass => studentClass.student)
    studentClass: StudentClass[];
}
