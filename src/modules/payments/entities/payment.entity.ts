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
@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  studentfeeid: number;

  @ManyToOne(() => StudentClass)
  @JoinColumn({ name: 'studentclassid' })
  studentClass: StudentClass;

  @ManyToOne(() => Paymenttypes)
  @JoinColumn({ name: 'paymenttypeid' })
  studentFeeType: Paymenttypes;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Months)
  @JoinColumn({ name: 'monthid' })
  monthid: Months;

  @CreateDateColumn()
  datecreated: Date;

  @UpdateDateColumn()
  dateupdated: Date;

}
