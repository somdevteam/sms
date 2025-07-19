import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Paymenttypes } from './paymenttype.entity';
import { StudentClass } from '../../studentModule/studentclass/entities/studentclass.entity';
import { Months } from '../../../common/months.entity';
import { PaymentStates } from './paymentstates.entity';
import { Responsible } from '../../studentModule/responsible/entities/responsible.entity';
import { Student } from '../../studentModule/student/entities/student.entity';
import { PaymentChargeRequest } from './payment-charge-request.entity';
import { Feetypes } from "./feetypes.entity";
import { Branch } from "../../branch/branch.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  studentfeeid: number;

  @ManyToOne(() => Student, { nullable: true })
  @JoinColumn({ name: 'studentid' })
  student: Student;

  @ManyToOne(() => StudentClass, { nullable: false })
  @JoinColumn({ name: 'studentclassid' })
  studentClass: StudentClass;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  amount: number;

  @ManyToOne(() => Months, { nullable: true })
  @JoinColumn({ name: 'monthid' })
  month: Months;

  @Column({ nullable: false })
  monthName: string;

  @Column({ nullable: false })
  academicYear: string;

  @ManyToOne(() => Paymenttypes, { nullable: false })
  @JoinColumn({ name: 'paymenttypeid' })
  paymentType: Paymenttypes;

  @ManyToOne(() => PaymentStates, { nullable: false })
  @JoinColumn({ name: 'paymentstateid' })
  paymentState: PaymentStates;

  @ManyToOne(() => Feetypes, { nullable: false })
  @JoinColumn({ name: 'feetypeid' })
  feeType: Feetypes;

  @ManyToOne(() => Branch, { nullable: true })
  @JoinColumn({ name: 'branchid' })
  branch: Branch;

  @Column({ nullable: false })
  rollNo: string;

  @Column({ nullable: true })
  details: string;

  @CreateDateColumn({ nullable: false })
  datecreated: Date;

  @UpdateDateColumn({ nullable: true })
  dateupdated: Date;

  @ManyToOne(() => Responsible, { nullable: true })
  @JoinColumn({ name: 'responsibleid' })
  responsible: Responsible;

  @ManyToOne(
    () => PaymentChargeRequest,
    (chargeRequest) => chargeRequest.payments,
    { nullable: true },
  )
  @JoinColumn({ name: 'charge_request_id', })
  chargeRequest: PaymentChargeRequest;

  @Column()
  isAutomatedPayment: boolean;
  @BeforeInsert()
  @BeforeUpdate()
  validateAmount() {
    if (this.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
  }
}
