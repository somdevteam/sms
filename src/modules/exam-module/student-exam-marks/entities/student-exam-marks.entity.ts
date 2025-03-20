import { StudentClass } from "src/modules/studentModule/studentclass/entities/studentclass.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExamsInfo } from "../../exams/entities/exam-info.entity";
import { Subject } from "src/modules/academicModule/subject/entities/subject.entity";

@Entity('student_exam_marks')
export class StudentExamMarks {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StudentClass, (studentClass) => studentClass.studentExamMarks)
    @JoinColumn({ name: 'student_class_id' })
    studentClass: StudentClass;

    @ManyToOne(() => ExamsInfo, (exam) => exam.examInfoId)
    @JoinColumn({ name: 'exam_info_id' })
    examInfo: ExamsInfo;

    @ManyToOne(() => Subject, (subject) => subject.studentExamMarks)
    @JoinColumn({ name: 'subject_id' })
    subject: Subject;

    @Column({type: 'decimal', precision: 10, scale: 2,nullable: true})
    mark: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

