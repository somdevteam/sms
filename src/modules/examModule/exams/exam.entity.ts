import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ExamsInfo } from '../exam-info/exam-info.entity';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn()
    examId: number;

    @Column()
    examName: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateCreate: Date;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => ExamsInfo, examsInfo => examsInfo.exam)
    examsInfo: ExamsInfo[];
}
