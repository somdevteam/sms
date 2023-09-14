
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import {StudentClass} from "../../studentModule/studentclass/entities/studentclass.entity";
import {Student} from "../../studentModule/student/entities/student.entity";

@Entity('student_leave')
export class StudentLeave {
    @PrimaryGeneratedColumn()
    studentLeaveID: number;
    @ManyToOne(() => StudentClass, { eager: true })
    @JoinColumn({ name: 'studentClassID' })
    studentClass: number;
    @ManyToOne(() => Student)
    @JoinColumn({ name: 'studentID' })
    student: number;
    @Column()
    reason: string;
    @Column('date')
    dateCreated: Date;
}

