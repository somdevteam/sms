// exams-info.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { AcademicBranch } from 'src/modules/branch-academic/entities/branch-academic.entity';
import { ClassExam } from './entities/class-exam.entity';

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

    @OneToMany(() => ClassExam, classExam => classExam.exam)
    classExams: ClassExam[];
}
