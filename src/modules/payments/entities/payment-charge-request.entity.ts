import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity
} from "typeorm";
import { Student } from "../../studentModule/student/entities/student.entity";
import { StudentClass } from "../../studentModule/studentclass/entities/studentclass.entity";
import { Payment } from "./payment.entity";
import { ChargeStatus } from '../enums/charge-status.enum';
import { ChargeType } from "./charge-type.entity";

@Entity()
export class PaymentChargeRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  chargeRequestId: number;

  @ManyToOne(() => Student, student => student.paymentCharges)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column()
  studentId: number;

  @ManyToOne(() => StudentClass, studentClass => studentClass.paymentCharges)
  @JoinColumn({ name: 'studentClassId' })
  studentClass: StudentClass;

  @Column()
  studentClassId: number;

  @Column()
  branchId: number;

  @Column()
  academicId: number;

  @Column()
  academicYear: string;

  @Column()
  levelId: number;

  @Column()
  levelFee: number;

  @Column()
  dueDate: Date;

  @ManyToOne(() => ChargeType, chargeType => chargeType.charges)
  @JoinColumn({ name: 'chargeTypeCode' })
  chargeType: ChargeType;

  @Column()
  chargeTypeCode: string;

  @Column()
  chargedMonth: string;

  @Column()
  status: ChargeStatus;

  @Column({ nullable: true })
  description: string;

  @Column()
  createdBy: number;

  @Column()
  loginHistoryId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Payment, payment => payment.chargeRequest)
  payments: Payment[];
} 
