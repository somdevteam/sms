import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Branch } from '../../branch/branch.entity';

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

export enum AccountCategory {
  // Asset Accounts (1000-1999)
  CASH = 'CASH',
  BANK = 'BANK',
  ACCOUNTS_RECEIVABLE = 'ACCOUNTS_RECEIVABLE',
  INVENTORY = 'INVENTORY',
  FIXED_ASSETS = 'FIXED_ASSETS',
  PREPAID_EXPENSES = 'PREPAID_EXPENSES',

  // Liability Accounts (2000-2999)
  ACCOUNTS_PAYABLE = 'ACCOUNTS_PAYABLE',
  LOANS_PAYABLE = 'LOANS_PAYABLE',
  ACCRUED_EXPENSES = 'ACCRUED_EXPENSES',

  // Equity Accounts (3000-3999)
  OWNER_CAPITAL = 'OWNER_CAPITAL',
  RETAINED_EARNINGS = 'RETAINED_EARNINGS',

  // Revenue Accounts (4000-4999)
  STUDENT_FEES = 'STUDENT_FEES',
  EXAM_FEES = 'EXAM_FEES',
  GRADUATION_FEES = 'GRADUATION_FEES',
  OTHER_INCOME = 'OTHER_INCOME',

  // Expense Accounts (5000-5999)
  TEACHER_SALARIES = 'TEACHER_SALARIES',
  STAFF_SALARIES = 'STAFF_SALARIES',
  MAINTENANCE = 'MAINTENANCE',
  UTILITIES = 'UTILITIES',
  RENT = 'RENT',
  OFFICE_SUPPLIES = 'OFFICE_SUPPLIES',
  MARKETING = 'MARKETING',
  INSURANCE = 'INSURANCE',
  OTHER_EXPENSES = 'OTHER_EXPENSES',
}

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  accountId: number;

  @Column({ unique: true })
  accountNumber: string;

  @Column()
  accountName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: AccountType,
  })
  accountType: AccountType;

  @Column({
    type: 'enum',
    enum: AccountCategory,
  })
  accountCategory: AccountCategory;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  openingBalance: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  currentBalance: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  @Column()
  branchId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => JournalEntry, (journalEntry) => journalEntry.account)
  journalEntries: JournalEntry[];

  @BeforeInsert()
  @BeforeUpdate()
  validateAccount() {
    if (!this.accountNumber || !this.accountName) {
      throw new Error('Account number and name are required');
    }

    if (
      this.openingBalance < 0 &&
      this.accountType !== AccountType.LIABILITY &&
      this.accountType !== AccountType.EXPENSE
    ) {
      throw new Error(
        'Opening balance cannot be negative for this account type',
      );
    }
  }
}
