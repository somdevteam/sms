import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Class } from "src/modules/academicModule/class/entities/class.entity";
import { ExamsInfo } from "../entities/exam-info.entity";



@Entity()
export class ClassExam {
  @PrimaryGeneratedColumn()
  class_exam_id: number;

  @ManyToOne(() => Class, classEntity => classEntity.classExams)
  @JoinColumn({ name: 'classid' })
  class: Class;

  @ManyToOne(() => ExamsInfo, exam => exam.classExams)
  @JoinColumn({ name: 'examid' })
  examInfo: ExamsInfo;
}