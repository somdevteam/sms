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
import { Feetypes } from "./feetypes.entity";
import { Branch } from "../../branch/branch.entity";

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
  academicId: number;

  @Column()
  academicYear: string;

  @Column()
  levelId: number;

  @Column()
  levelFee: number;

  @Column()
  amount: number;

  @Column()
  dueDate: Date;

  @ManyToOne(() => ChargeType, chargeType => chargeType.charges)
  @JoinColumn({ name: 'chargeTypeId' })
  chargeType: ChargeType;

  @Column()
  chargeTypeByCode: string;

  @Column()
  chargedMonth: string;

  @Column()
  status: ChargeStatus;

  @Column({ nullable: true })
  description: string;

  @Column()
  createdBy: number;

  @Column({nullable:true})
  loginHistoryId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Payment, payment => payment.chargeRequest)
  payments: Payment[];

  @ManyToOne(() => Feetypes, { nullable: false })
  @JoinColumn({ name: 'feetypeid' })
  feeType: Feetypes;

  @ManyToOne(() => Branch, { nullable: true })
  @JoinColumn({ name: 'branchid' })
  branch: Branch;

} 
