// exams-info.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Exam } from '../exams/exam.entity';
import { AcademicBranch } from 'src/modules/branch-academic/entities/branch-academic.entity';

@Entity()
export class ExamsInfo {
    @PrimaryGeneratedColumn()
    examInfoId: number;

    @OneToOne(() => Exam, exam => exam.examsInfo)
    @JoinColumn({ name: 'examId' })
    exam: Exam;

    @ManyToOne(() => AcademicBranch, academicBranch => academicBranch.examInfo)
    @JoinColumn({ name: 'academicBranch' })
    academicBranch: AcademicBranch;

    @Column({ type: 'text' })
    description: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateCreated: Date;
}
