// exams-info.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { AcademicBranch } from 'src/modules/branch-academic/entities/branch-academic.entity';
import { Exam } from './exam.entity';
import { ClassExam } from './class-exam.entity';
import { StudentExamMarks } from '../../student-exam-marks/entities/student-exam-marks.entity';
@Entity()
export class ExamsInfo {
    @PrimaryGeneratedColumn()
    examInfoId: number;

    @OneToOne(() => Exam, exam => exam.examsInfo)
    @JoinColumn({ name: 'examId' })
    exam: Exam;

    @ManyToOne(() => AcademicBranch, academicBranch => academicBranch.examInfo)
    @JoinColumn({ name: 'academicBranchId' })
    academicBranch: AcademicBranch;

    @Column({ type: 'text' })
    description: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({nullable: true})
    examMarks: number


    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateCreated: Date;

    @OneToMany(() => ClassExam, classExam => classExam.examInfo)
    classExams: ClassExam[];

    @OneToMany(() => StudentExamMarks, studentExamMarks => studentExamMarks.examInfo)
    studentExamMarks: StudentExamMarks[];
}
