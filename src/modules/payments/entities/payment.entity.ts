import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Paymenttypes } from "./paymenttype.entity";
import { StudentClass } from "../../studentModule/studentclass/entities/studentclass.entity";
import { Months } from "../../../common/months.entity";
import { PaymentStates } from "./paymentstates.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  studentfeeid: number;

  @ManyToOne(() => StudentClass)
  @JoinColumn({ name: "studentclassid" })
  studentClass: StudentClass;

  @ManyToOne(() => Paymenttypes)
  @JoinColumn({ name: "paymenttypeid" })
  studentFeeType: Paymenttypes;

  @ManyToOne(() => PaymentStates)
  @JoinColumn({ name: "paymentstateid" })
  paymentStateId: PaymentStates;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column()
  monthName: string;

  @CreateDateColumn()
  datecreated: Date;

  @UpdateDateColumn()
  dateupdated: Date;

  @Column()
  rollNo:string;

}
