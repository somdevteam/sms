import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Branch } from '../../branch/branch.entity';
import { JournalEntry } from './journal-entry.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum TransactionStatus {
  PENDING = 'PENDING',
  POSTED = 'POSTED',
  VOIDED = 'VOIDED',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  transactionId: number;

  @Column({ unique: true })
  transactionNumber: string;

  @Column({ type: 'date' })
  transactionDate: Date;

  @Column({ type: 'text' })
  description: string;

  @Column('decimal', { precision: 15, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  @Column()
  branchId: number;

  @ManyToOne(() => Payment, { nullable: true })
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @Column({ nullable: true })
  paymentId: number;

  @Column({ nullable: true })
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => JournalEntry, (journalEntry) => journalEntry.transaction)
  journalEntries: JournalEntry[];

  @BeforeInsert()
  @BeforeUpdate()
  validateTransaction() {
    if (this.totalAmount <= 0) {
      throw new Error('Total amount must be greater than 0');
    }

    if (!this.transactionDate) {
      this.transactionDate = new Date();
    }
  }
}
