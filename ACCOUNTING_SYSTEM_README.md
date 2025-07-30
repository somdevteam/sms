# School Management System - Accounting Module

## Overview

This accounting system implements a comprehensive double-entry bookkeeping system for the school management system. It tracks all financial transactions branch-wise, providing detailed financial reporting and analysis capabilities.

## Features

### 1. **Chart of Accounts**

- **Asset Accounts** (1000-1999): Cash, Bank, Accounts Receivable, etc.
- **Liability Accounts** (2000-2999): Accounts Payable, Loans, etc.
- **Equity Accounts** (3000-3999): Owner's Capital, Retained Earnings
- **Revenue Accounts** (4000-4999): Student Fees, Exam Fees, Graduation Fees
- **Expense Accounts** (5000-5999): Teacher Salaries, Maintenance, Utilities

### 2. **Double-Entry Bookkeeping**

Every transaction affects at least two accounts:

- **Debit (Dr)**: Increases assets/expenses, decreases liabilities/revenue
- **Credit (Cr)**: Increases liabilities/revenue, decreases assets/expenses

### 3. **Branch-Based Accounting**

Each branch has its own set of accounts, ensuring financial isolation and proper reporting.

### 4. **Automatic Payment Recording**

Student payments are automatically recorded as journal entries when payments are created.

## Database Schema

### Core Entities

#### 1. **Account Entity**

```typescript
@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  accountId: number;

  @Column({ unique: true })
  accountNumber: string; // Format: {branchId}{category}{sequence}

  @Column()
  accountName: string;

  @Column({ type: 'enum', enum: AccountType })
  accountType: AccountType; // ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE

  @Column({ type: 'enum', enum: AccountCategory })
  accountCategory: AccountCategory; // CASH, BANK, STUDENT_FEES, etc.

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  openingBalance: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  currentBalance: number;

  @ManyToOne(() => Branch, { nullable: false })
  branch: Branch;
}
```

#### 2. **Journal Entry Entity**

```typescript
@Entity()
export class JournalEntry {
  @PrimaryGeneratedColumn()
  journalEntryId: number;

  @Column({ unique: true })
  transactionNumber: string; // Format: TXN-{branchId}-{date}-{sequence}

  @Column({ type: 'date' })
  transactionDate: Date;

  @Column({ type: 'enum', enum: TransactionType })
  transactionType: TransactionType; // DEBIT or CREDIT

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: JournalEntryType })
  entryType: JournalEntryType; // MANUAL, PAYMENT, EXPENSE, ADJUSTMENT

  @ManyToOne(() => Account, { nullable: false })
  account: Account;

  @ManyToOne(() => Branch, { nullable: false })
  branch: Branch;

  @ManyToOne(() => Payment, { nullable: true })
  payment: Payment; // Links to student payment if applicable
}
```

#### 3. **Transaction Entity**

```typescript
@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  transactionId: number;

  @Column({ unique: true })
  transactionNumber: string;

  @Column('decimal', { precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus; // PENDING, POSTED, VOIDED

  @OneToMany(() => JournalEntry, (journalEntry) => journalEntry.transaction)
  journalEntries: JournalEntry[];
}
```

## API Endpoints

### Account Management

- `POST /accounting/accounts` - Create new account
- `GET /accounting/accounts` - Get all accounts (with optional branch filter)
- `GET /accounting/accounts/:id` - Get account by ID
- `PATCH /accounting/accounts/:id` - Update account
- `DELETE /accounting/accounts/:id` - Delete account (soft delete)

### Journal Entries

- `POST /accounting/journal-entries` - Create new journal entry
- `GET /accounting/journal-entries` - Get all journal entries (with filters)

### Financial Reports

- `POST /accounting/reports/trial-balance` - Generate trial balance
- `POST /accounting/reports/income-statement` - Generate income statement
- `POST /accounting/reports/balance-sheet` - Generate balance sheet

### Lookup Data

- `GET /accounting/account-types` - Get account types
- `GET /accounting/account-categories` - Get account categories
- `GET /accounting/transaction-types` - Get transaction types
- `GET /accounting/journal-entry-types` - Get journal entry types

## Usage Examples

### 1. Creating a New Account

```typescript
const newAccount = {
  accountNumber: '11001',
  accountName: 'Main Bank Account',
  description: 'Primary bank account for branch 1',
  accountType: 'ASSET',
  accountCategory: 'BANK',
  openingBalance: 10000,
  branchId: 1,
};

await accountingService.createAccount(newAccount);
```

### 2. Creating a Manual Journal Entry

```typescript
const journalEntry = {
  transactionDate: '2024-01-15',
  description: 'Payment for office supplies',
  entryType: 'EXPENSE',
  branchId: 1,
  journalEntries: [
    {
      accountId: 15, // Office Supplies account
      transactionType: 'DEBIT',
      amount: 500,
      description: 'Office supplies purchase',
    },
    {
      accountId: 2, // Bank account
      transactionType: 'CREDIT',
      amount: 500,
      description: 'Payment for office supplies',
    },
  ],
};

await accountingService.createJournalEntry(journalEntry);
```

### 3. Generating Financial Reports

```typescript
// Trial Balance
const trialBalance = await accountingService.getTrialBalance({
  branchId: 1,
  asOfDate: '2024-01-31',
});

// Income Statement
const incomeStatement = await accountingService.getIncomeStatement({
  branchId: 1,
  startDate: '2024-01-01',
  endDate: '2024-01-31',
});

// Balance Sheet
const balanceSheet = await accountingService.getBalanceSheet({
  branchId: 1,
  asOfDate: '2024-01-31',
});
```

## Automatic Payment Integration

When a student payment is created, the system automatically:

1. **Debits** the Cash/Bank account
2. **Credits** the appropriate Revenue account (Student Fees, Exam Fees, etc.)
3. **Links** the journal entry to the payment record
4. **Updates** account balances in real-time

Example payment transaction:

```
Student Payment - Class Fee ($500)
├── Debit: Cash Account ($500)
└── Credit: Student Fees Revenue ($500)
```

## Account Numbering System

Each account has a unique number following this pattern:

- **Format**: `{branchId}{category}{sequence}`
- **Example**: `11001` = Branch 1, Asset category, sequence 01

### Category Ranges:

- **1000-1999**: Asset accounts
- **2000-2999**: Liability accounts
- **3000-3999**: Equity accounts
- **4000-4999**: Revenue accounts
- **5000-5999**: Expense accounts

## Setup Instructions

### 1. Database Migration

Run the TypeORM migrations to create the accounting tables:

```bash
npm run migration:run
```

### 2. Seed Default Accounts

Initialize the system with default accounts for each branch:

```typescript
// In your application startup
const seedService = app.get(AccountingSeedService);
await seedService.seedDefaultAccounts();
```

### 3. Configure Branch Settings

Ensure each branch has the necessary accounts created before processing transactions.

## Angular Frontend

The Angular frontend provides:

1. **Accounting Dashboard** - Overview of financial metrics
2. **Account Management** - CRUD operations for accounts
3. **Journal Entry Management** - Create and view transactions
4. **Financial Reports** - Trial balance, income statement, balance sheet
5. **Real-time Updates** - Account balances update automatically

## Security Considerations

1. **Branch Isolation** - Users can only access accounts for their assigned branch
2. **Audit Trail** - All transactions are logged with timestamps and user information
3. **Validation** - Double-entry validation ensures debits equal credits
4. **Transaction Integrity** - All operations use database transactions

## Best Practices

1. **Regular Reconciliation** - Reconcile account balances monthly
2. **Backup Procedures** - Regular database backups for financial data
3. **User Training** - Train users on proper journal entry procedures
4. **Documentation** - Maintain proper documentation for all transactions
5. **Review Process** - Implement approval workflows for large transactions

## Troubleshooting

### Common Issues:

1. **Debit/Credit Mismatch**

   - Ensure total debits equal total credits in each transaction
   - Check account types and their normal balance

2. **Account Not Found**

   - Verify account exists and is active
   - Check branch assignment

3. **Balance Calculation Errors**
   - Recalculate account balances from journal entries
   - Check for orphaned transactions

### Support:

For technical support, contact the development team or refer to the API documentation.

## **How Debits and Credits Actually Work in the Code**

### **Step 1: When a Student Payment is Created**

When you create a student payment, this happens automatically:

```typescript
// In PaymentsService.create() method
const result = await queryRunner.manager.save(payment);

// Automatically record the accounting transaction
await this.accountingService.recordPaymentTransaction(result);
```

### **Step 2: The recordPaymentTransaction Method**

```typescript
async recordPaymentTransaction(payment: Payment): Promise<void> {
  // 1. Get the Cash account for this branch
  const cashAccount = await this.getCashAccount(payment.branch.branchId);

  // 2. Get the Revenue account based on fee type
  const revenueAccount = await this.getRevenueAccount(
    payment.feeType.description, // "Class Fee", "Exam Fee", etc.
    payment.branch.branchId
  );

  // 3. Create the journal entries
  const journalEntries: JournalEntryLineDto[] = [
    {
      accountId: cashAccount.accountId,        // Cash Account (Asset)
      transactionType: TransactionType.DEBIT,  // DEBIT Cash
      amount: payment.amount,                  // $500
      description: `Payment received for ${payment.feeType.description}`
    },
    {
      accountId: revenueAccount.accountId,     // Student Fees Account (Revenue)
      transactionType: TransactionType.CREDIT, // CREDIT Revenue
      amount: payment.amount,                  // $500
      description: `Revenue from ${payment.feeType.description}`
    }
  ];

  // 4. Create the journal entry
  await this.createJournalEntry(createJournalEntryDto);
}
```

### **Step 3: Account Balance Updates**

This is the **key part** - how account balances are updated:

```typescript
private async updateAccountBalances(
  queryRunner: any,
  journalEntries: JournalEntryLineDto[],
): Promise<void> {
  for (const entry of journalEntries) {
    const account = await queryRunner.manager.findOne(Account, {
      where: { accountId: entry.accountId },
    });

    if (entry.transactionType === TransactionType.DEBIT) {
      // DEBIT transaction
      if (account.accountType === AccountType.ASSET ||
          account.accountType === AccountType.EXPENSE) {
        account.currentBalance += entry.amount;  // Increase Asset/Expense
      } else {
        account.currentBalance -= entry.amount;  // Decrease Liability/Revenue/Equity
      }
    } else {
      // CREDIT transaction
      if (account.accountType === AccountType.ASSET ||
          account.accountType === AccountType.EXPENSE) {
        account.currentBalance -= entry.amount;  // Decrease Asset/Expense
      } else {
        account.currentBalance += entry.amount;  // Increase Liability/Revenue/Equity
      }
    }

    await queryRunner.manager.save(account);
  }
}
```

### **Step 4: Real Example with Numbers**

Let's say a student pays $500 for class fees:

**Before Transaction:**

- Cash Account: $1,000
- Student Fees Revenue: $5,000

**Transaction:**

```typescript
<code_block_to_apply_changes_from>
```

**After Transaction:**

- Cash Account: $1,500 ✅ (Asset increased with DEBIT)
- Student Fees Revenue: $5,500 ✅ (Revenue increased with CREDIT)

### **Step 5: Validation**

The system validates that debits equal credits:

```typescript
private validateDoubleEntry(journalEntries: JournalEntryLineDto[]): void {
  const totalDebits = journalEntries
    .filter((entry) => entry.transactionType === TransactionType.DEBIT)
    .reduce((sum, entry) => sum + entry.amount, 0);  // $500

  const totalCredits = journalEntries
    .filter((entry) => entry.transactionType === TransactionType.CREDIT)
    .reduce((sum, entry) => sum + entry.amount, 0);  // $500

  if (Math.abs(totalDebits - totalCredits) > 0.01) {
    throw new BadRequestException(
      `Debits (${totalDebits}) must equal credits (${totalCredits})`
    );
  }
  // ✅ $500 = $500, transaction is valid
}
```

### **Step 6: Manual Journal Entry Example**

For expenses like teacher salaries:

```typescript
const journalEntries = [
  {
    accountId: teacherSalariesAccount.accountId, // Teacher Salaries (Expense)
    transactionType: TransactionType.DEBIT, // DEBIT Expense
    amount: 2000,
  },
  {
    accountId: bankAccount.accountId, // Bank Account (Asset)
    transactionType: TransactionType.CREDIT, // CREDIT Bank
    amount: 2000,
  },
];
```

**What happens:**

- **Teacher Salaries**: DEBIT $2,000 → Expense increases (normal for expenses)
- **Bank Account**: CREDIT $2,000 → Asset decreases (normal for assets)

### **The Key Rules in Code:**

1. **Assets & Expenses**: Increase with DEBIT, decrease with CREDIT
2. **Liabilities, Equity & Revenue**: Increase with CREDIT, decrease with DEBIT
3. **Every transaction**: Must have equal debits and credits
4. **Account balances**: Update automatically based on these rules

This ensures that:

- ✅ **Assets = Liabilities + Equity** (Accounting Equation)
- ✅ **Revenue - Expenses = Net Income**
- ✅ **All transactions are balanced**

The system automatically handles all the complex accounting rules, so you just need to create payments or journal entries, and the debits/credits are applied correctly!
