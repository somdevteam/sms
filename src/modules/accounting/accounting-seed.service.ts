import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Account,
  AccountType,
  AccountCategory,
} from './entities/account.entity';
import { Branch } from '../branch/branch.entity';

@Injectable()
export class AccountingSeedService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) {}

  async seedDefaultAccounts(): Promise<void> {
    const branches = await this.branchRepository.find();

    for (const branch of branches) {
      await this.createDefaultAccountsForBranch(branch.branchId);
    }
  }

  private async createDefaultAccountsForBranch(
    branchId: number,
  ): Promise<void> {
    const defaultAccounts = [
      // Asset Accounts (1000-1999)
      {
        accountNumber: `${branchId}1001`,
        accountName: 'Cash',
        description: 'Cash on hand and in bank',
        accountType: AccountType.ASSET,
        accountCategory: AccountCategory.CASH,
        openingBalance: 0,
      },
      {
        accountNumber: `${branchId}1002`,
        accountName: 'Bank Account',
        description: 'Main bank account',
        accountType: AccountType.ASSET,
        accountCategory: AccountCategory.BANK,
        openingBalance: 0,
      },
      {
        accountNumber: `${branchId}1003`,
        accountName: 'Accounts Receivable',
        description: 'Money owed by students and others',
        accountType: AccountType.ASSET,
        accountCategory: AccountCategory.ACCOUNTS_RECEIVABLE,
        openingBalance: 0,
      },

      // Liability Accounts (2000-2999)
      {
        accountNumber: `${branchId}2001`,
        accountName: 'Accounts Payable',
        description: 'Money owed to suppliers and vendors',
        accountType: AccountType.LIABILITY,
        accountCategory: AccountCategory.ACCOUNTS_PAYABLE,
        openingBalance: 0,
      },
      {
        accountNumber: `${branchId}2002`,
        accountName: 'Accrued Expenses',
        description: 'Expenses incurred but not yet paid',
        accountType: AccountType.LIABILITY,
        accountCategory: AccountCategory.ACCRUED_EXPENSES,
        openingBalance: 0,
      },

      // Equity Accounts (3000-3999)
      {
        accountNumber: `${branchId}3001`,
        accountName: 'Owner Capital',
        description: 'Initial investment by owner',
        accountType: AccountType.EQUITY,
        accountCategory: AccountCategory.OWNER_CAPITAL,
        openingBalance: 0,
      },
      {
        accountNumber: `${branchId}3002`,
        accountName: 'Retained Earnings',
        description: 'Accumulated profits',
        accountType: AccountType.EQUITY,
        accountCategory: AccountCategory.RETAINED_EARNINGS,
        openingBalance: 0,
      },

      // Revenue Accounts (4000-4999)
      {
        accountNumber: `${branchId}4001`,
        accountName: 'Student Fees',
        description: 'Revenue from student tuition fees',
        accountType: AccountType.REVENUE,
        accountCategory: AccountCategory.STUDENT_FEES,
        openingBalance: 0,
      },
      {
        accountNumber: `${branchId}4002`,
        accountName: 'Exam Fees',
        description: 'Revenue from examination fees',
        accountType: AccountType.REVENUE,
        accountCategory: AccountCategory.EXAM_FEES,
        openingBalance: 0,
      },
      {
        accountNumber: `${branchId}4003`,
        accountName: 'Graduation Fees',
        description: 'Revenue from graduation ceremony fees',
        accountType: AccountType.REVENUE,
        accountCategory: AccountCategory.GRADUATION_FEES,
        openingBalance: 0,
      },
      {
        accountNumber: `${branchId}4004`,
        accountName: 'Other Income',
        description: 'Miscellaneous income',
        accountType: AccountType.REVENUE,
        accountCategory: AccountCategory.OTHER_INCOME,
        openingBalance: 0,
      },

      // Expense Accounts (5000-5999)
      {
        accountNumber: `${branchId}5001`,
        accountName: 'Teacher Salaries',
        description: 'Salaries and wages for teachers',
        accountType: AccountType.EXPENSE,
        accountCategory: AccountCategory.TEACHER_SALARIES,
        openingBalance: 0,
      },
      {
        accountNumber: `${branchId}5002`,
        accountName: 'Staff Salaries',
        description: 'Salaries and wages for administrative staff',
        accountType: AccountType.EXPENSE,
        accountCategory: AccountCategory.STAFF_SALARIES,
        openingBalance: 0,
      },
      {
        accountNumber: `${branchId}5003`,
        accountName: 'Maintenance',
        description: 'Building and equipment maintenance',
        accountType: AccountType.EXPENSE,
        accountCategory: AccountCategory.MAINTENANCE,
        openingBalance: 0,
      },
      {
        accountNumber: `${branchId}5004`,
        accountName: 'Utilities',
        description: 'Electricity, water, internet, etc.',
        accountType: AccountType.EXPENSE,
        accountCategory: AccountCategory.UTILITIES,
        openingBalance: 0,
      },
      {
        accountNumber: `${branchId}5005`,
        accountName: 'Rent',
        description: 'Building rent expenses',
        accountType: AccountType.EXPENSE,
        accountCategory: AccountCategory.RENT,
        openingBalance: 0,
      },
      {
        accountNumber: `${branchId}5006`,
        accountName: 'Office Supplies',
        description: 'Office supplies and materials',
        accountType: AccountType.EXPENSE,
        accountCategory: AccountCategory.OFFICE_SUPPLIES,
        openingBalance: 0,
      },
      {
        accountNumber: `${branchId}5007`,
        accountName: 'Marketing',
        description: 'Advertising and marketing expenses',
        accountType: AccountType.EXPENSE,
        accountCategory: AccountCategory.MARKETING,
        openingBalance: 0,
      },
      {
        accountNumber: `${branchId}5008`,
        accountName: 'Insurance',
        description: 'Insurance premiums',
        accountType: AccountType.EXPENSE,
        accountCategory: AccountCategory.INSURANCE,
        openingBalance: 0,
      },
      {
        accountNumber: `${branchId}5009`,
        accountName: 'Other Expenses',
        description: 'Miscellaneous expenses',
        accountType: AccountType.EXPENSE,
        accountCategory: AccountCategory.OTHER_EXPENSES,
        openingBalance: 0,
      },
    ];

    for (const accountData of defaultAccounts) {
      const existingAccount = await this.accountRepository.findOne({
        where: { accountNumber: accountData.accountNumber },
      });

      if (!existingAccount) {
        const account = this.accountRepository.create({
          ...accountData,
          branchId,
          isActive: true,
        });
        await this.accountRepository.save(account);
      }
    }
  }
}
