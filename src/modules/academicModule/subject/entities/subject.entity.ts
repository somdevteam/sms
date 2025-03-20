import { ClassSubject } from "src/modules/academicModule/class-subject/entities/class-subject.entity";
import { StudentExamMarks } from "src/modules/exam-module/student-exam-marks/entities/student-exam-marks.entity";
import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
@Entity('subject')
export class Subject extends BaseEntity{
    @PrimaryGeneratedColumn()
    subject_id:number;

    @Column()
    @Unique(['subject_name'])
    
    subject_name:string;
    @Column()
    datecreated: Date;
    @Column({default: true})
    isactive: boolean;
    @OneToMany(() => ClassSubject, clsSub => clsSub.subject)
    classSubject: ClassSubject

    @OneToMany(() => StudentExamMarks, studentExamMarks => studentExamMarks.subject)
    studentExamMarks: StudentExamMarks;
}