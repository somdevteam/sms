import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";
import { Student } from "../../studentModule/student/entities/student.entity";
import { StudentClass } from "../../studentModule/studentclass/entities/studentclass.entity";
import { Payment } from "./payment.entity";
import { ChargeStatus } from '../enums/charge-status.enum';

export enum DueCategory {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY'
}

@Entity()
export class PaymentChargeRequest {
  @PrimaryGeneratedColumn()
  chargeRequestId: number;

  @ManyToOne(() => Student, { nullable: false })
  @JoinColumn({ name: "studentid" })
  student: Student;

  @ManyToOne(() => StudentClass, { nullable: false })
  @JoinColumn({ name: "studentclassid" })
  studentClass: StudentClass;

  @Column("decimal", { precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'date', nullable: false })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: DueCategory,
    nullable: false
  })
  dueCategory: DueCategory;

  @Column({
    type: 'enum',
    enum: ChargeStatus,
    default: ChargeStatus.PENDING
  })
  status: ChargeStatus;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ nullable: false })
  dateCreated: Date;

  @UpdateDateColumn({ nullable: true })
  dateUpdated: Date;

  @OneToMany(() => Payment, payment => payment.chargeRequest)
  payments: Payment[];
} 