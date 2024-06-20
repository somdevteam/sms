import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Class } from "src/modules/academicModule/class/entities/class.entity";
import { ExamsInfo } from "../../exams/exam-info.entity";

@Entity()
export class ClassExam {
  @PrimaryGeneratedColumn()
  classexam: number;

  @ManyToOne(() => Class, classEntity => classEntity.classExams)
  @JoinColumn({ name: 'classid' })
  class: Class;

  @ManyToOne(() => ExamsInfo, exam => exam.classExams)
  @JoinColumn({ name: 'examid' })
  exam: ExamsInfo;
}