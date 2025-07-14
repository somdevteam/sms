import { ClassSection } from "src/modules/academicModule/class-section/entities/class-section.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { BaseEntity } from "typeorm";
import { Student } from "./student.entity";
import { Payment } from "src/modules/payments/entities/payment.entity";
import { StudentExamMarks } from "src/modules/exam-module/student-exam-marks/entities/student-exam-marks.entity";
import { StudentAttendance } from "./student-attendance.entity";
@Entity()
export class StudentClass extends BaseEntity{
    @PrimaryGeneratedColumn()
    studentClassId: number;

    @ManyToOne(()=>ClassSection, classSection =>classSection.studentClass)
    @JoinColumn({name:"classsectionid"})
    classSection: ClassSection;

    @ManyToOne(() => Student, student => student.studentClass)
    @JoinColumn({name:'studentid'})
    student: Student;
    @Column()
    dateCreated: Date;

    @OneToMany(()=>Payment,payment =>payment.studentClass)
    payment: Payment;

    @OneToMany(()=> StudentExamMarks ,studentExamMarks =>studentExamMarks.studentClass)
    studentExamMarks: StudentExamMarks;

    @OneToMany(() => StudentAttendance, att => att.studentClass)
    studentAttendance: StudentAttendance[];
}
