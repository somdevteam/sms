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
import { Branch } from '../../branch/branch.entity';
import { Account } from './account.entity';
import { Transaction } from './transaction.entity';

export enum ExpenseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHECK = 'CHECK',
  CREDIT_CARD = 'CREDIT_CARD',
  OTHER = 'OTHER',
}

export enum ExpenseCategory {
  TEACHER_SALARIES = 'TEACHER_SALARIES',
  STAFF_SALARIES = 'STAFF_SALARIES',
  MAINTENANCE = 'MAINTENANCE',
  UTILITIES = 'UTILITIES',
  RENT = 'RENT',
  OFFICE_SUPPLIES = 'OFFICE_SUPPLIES',
  MARKETING = 'MARKETING',
  INSURANCE = 'INSURANCE',
  TRAVEL = 'TRAVEL',
  TRAINING = 'TRAINING',
  EQUIPMENT = 'EQUIPMENT',
  OTHER_EXPENSES = 'OTHER_EXPENSES',
}

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  expenseId: number;

  @Column({ unique: true })
  expenseNumber: string;

  @Column({ type: 'date' })
  expenseDate: Date;

  @Column({ type: 'text' })
  description: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ExpenseCategory,
  })
  expenseCategory: ExpenseCategory;

  @Column({ type: 'text', nullable: true })
  vendorName: string;

  @Column({ type: 'text', nullable: true })
  invoiceNumber: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: ExpenseStatus,
    default: ExpenseStatus.PENDING,
  })
  status: ExpenseStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  receiptNumber: string;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  @Column()
  branchId: number;

  @ManyToOne(() => Account, { nullable: false })
  @JoinColumn({ name: 'expenseAccountId' })
  expenseAccount: Account;

  @Column()
  expenseAccountId: number;

  @ManyToOne(() => Account, { nullable: false })
  @JoinColumn({ name: 'paymentAccountId' })
  paymentAccount: Account;

  @Column()
  paymentAccountId: number;

  @ManyToOne(() => Transaction, { nullable: true })
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  @Column({ nullable: true })
  transactionId: number;

  @Column({ nullable: true })
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  validateExpense() {
    if (this.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (!this.expenseDate) {
      this.expenseDate = new Date();
    }

    if (!this.expenseNumber) {
      // Generate expense number if not provided
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      this.expenseNumber = `EXP-${
        this.branchId
      }-${year}${month}${day}-${Date.now()}`;
    }
  }
}
