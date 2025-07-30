import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  Account,
  AccountType,
  AccountCategory,
} from './entities/account.entity';
import {
  JournalEntry,
  TransactionType,
  JournalEntryType,
} from './entities/journal-entry.entity';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import {
  CreateJournalEntryDto,
  JournalEntryLineDto,
} from './dto/create-journal-entry.dto';
import { Branch } from '../branch/branch.entity';
import { Payment } from '../payments/entities/payment.entity';

@Injectable()
export class AccountingService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(JournalEntry)
    private journalEntryRepository: Repository<JournalEntry>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private dataSource: DataSource,
  ) {}

  // Account Management
  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if account number already exists
      const existingAccount = await this.accountRepository.findOne({
        where: { accountNumber: createAccountDto.accountNumber },
      });

      if (existingAccount) {
        throw new ConflictException('Account number already exists');
      }

      // Validate branch exists
      const branch = await this.branchRepository.findOne({
        where: { branchId: createAccountDto.branchId },
      });

      if (!branch) {
        throw new NotFoundException('Branch not found');
      }

      // Create account
      const account = this.accountRepository.create({
        ...createAccountDto,
        currentBalance: createAccountDto.openingBalance || 0,
      });

      const savedAccount = await queryRunner.manager.save(account);

      // If opening balance is provided, create initial journal entry
      if (
        createAccountDto.openingBalance &&
        createAccountDto.openingBalance > 0
      ) {
        await this.createOpeningBalanceEntry(
          queryRunner,
          savedAccount,
          createAccountDto.openingBalance,
        );
      }

      await queryRunner.commitTransaction();
      return savedAccount;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error creating account: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAllAccounts(branchId?: number): Promise<Account[]> {
    const queryBuilder = this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.branch', 'branch')
      .where('account.isActive = :isActive', { isActive: true });

    if (branchId) {
      queryBuilder.andWhere('account.branchId = :branchId', { branchId });
    }

    return await queryBuilder.orderBy('account.accountNumber', 'ASC').getMany();
  }

  async findAccountById(accountId: number): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { accountId },
      relations: ['branch'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async updateAccount(
    accountId: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.findAccountById(accountId);

    Object.assign(account, updateAccountDto);
    return await this.accountRepository.save(account);
  }

  async deleteAccount(accountId: number): Promise<void> {
    const account = await this.findAccountById(accountId);

    // Check if account has any transactions
    const hasTransactions = await this.journalEntryRepository.findOne({
      where: { accountId },
    });

    if (hasTransactions) {
      throw new BadRequestException(
        'Cannot delete account with existing transactions',
      );
    }

    account.isActive = false;
    await this.accountRepository.save(account);
  }

  // Journal Entry Management
  async createJournalEntry(
    createJournalEntryDto: CreateJournalEntryDto,
  ): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate double-entry bookkeeping
      this.validateDoubleEntry(createJournalEntryDto.journalEntries);

      // Generate transaction number
      const transactionNumber = await this.generateTransactionNumber(
        createJournalEntryDto.branchId,
      );

      // Create transaction
      const transaction = this.transactionRepository.create({
        transactionNumber,
        transactionDate: new Date(createJournalEntryDto.transactionDate),
        description: createJournalEntryDto.description,
        totalAmount: this.calculateTotalAmount(
          createJournalEntryDto.journalEntries,
        ),
        status: TransactionStatus.POSTED,
        notes: createJournalEntryDto.notes,
        branchId: createJournalEntryDto.branchId,
        paymentId: createJournalEntryDto.paymentId,
      });

      const savedTransaction = await queryRunner.manager.save(transaction);

      // Create journal entries
      const journalEntries = createJournalEntryDto.journalEntries.map((entry) =>
        this.journalEntryRepository.create({
          transactionNumber: `${transactionNumber}-${entry.accountId}`,
          transactionDate: new Date(createJournalEntryDto.transactionDate),
          transactionType: entry.transactionType,
          amount: entry.amount,
          description: entry.description,
          entryType: createJournalEntryDto.entryType || JournalEntryType.MANUAL,
          referenceNumber: createJournalEntryDto.referenceNumber,
          notes: createJournalEntryDto.notes,
          accountId: entry.accountId,
          branchId: createJournalEntryDto.branchId,
          paymentId: createJournalEntryDto.paymentId,
          transactionId: savedTransaction.transactionId,
        }),
      );

      await queryRunner.manager.save(journalEntries);

      // Update account balances
      await this.updateAccountBalances(
        queryRunner,
        createJournalEntryDto.journalEntries,
      );

      await queryRunner.commitTransaction();
      return savedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error creating journal entry: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAllJournalEntries(
    branchId?: number,
    startDate?: string,
    endDate?: string,
  ): Promise<JournalEntry[]> {
    const queryBuilder = this.journalEntryRepository
      .createQueryBuilder('journalEntry')
      .leftJoinAndSelect('journalEntry.account', 'account')
      .leftJoinAndSelect('journalEntry.branch', 'branch')
      .leftJoinAndSelect('journalEntry.transaction', 'transaction')
      .orderBy('journalEntry.transactionDate', 'DESC');

    if (branchId) {
      queryBuilder.andWhere('journalEntry.branchId = :branchId', { branchId });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'DATE(journalEntry.transactionDate) BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    }

    return await queryBuilder.getMany();
  }

  // Financial Reports
  async getTrialBalance(branchId: number, asOfDate?: string): Promise<any> {
    const queryBuilder = this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.branch', 'branch')
      .where('account.branchId = :branchId', { branchId })
      .andWhere('account.isActive = :isActive', { isActive: true });

    const accounts = await queryBuilder.getMany();

    const trialBalance = accounts.map((account) => {
      let debitBalance = 0;
      let creditBalance = 0;

      if (
        account.accountType === AccountType.ASSET ||
        account.accountType === AccountType.EXPENSE
      ) {
        debitBalance = account.currentBalance;
      } else {
        creditBalance = account.currentBalance;
      }

      return {
        accountId: account.accountId,
        accountNumber: account.accountNumber,
        accountName: account.accountName,
        accountType: account.accountType,
        accountCategory: account.accountCategory,
        debitBalance,
        creditBalance,
      };
    });

    const totalDebits = trialBalance.reduce(
      (sum, account) => sum + account.debitBalance,
      0,
    );
    const totalCredits = trialBalance.reduce(
      (sum, account) => sum + account.creditBalance,
      0,
    );

    return {
      trialBalance,
      totalDebits,
      totalCredits,
      difference: totalDebits - totalCredits,
    };
  }

  async getIncomeStatement(
    branchId: number,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    const revenueAccounts = await this.accountRepository.find({
      where: {
        branchId,
        accountType: AccountType.REVENUE,
        isActive: true,
      },
    });

    const expenseAccounts = await this.accountRepository.find({
      where: {
        branchId,
        accountType: AccountType.EXPENSE,
        isActive: true,
      },
    });

    const revenues = await this.calculateAccountBalances(
      revenueAccounts,
      startDate,
      endDate,
    );
    const expenses = await this.calculateAccountBalances(
      expenseAccounts,
      startDate,
      endDate,
    );

    const totalRevenue = revenues.reduce(
      (sum, account) => sum + account.balance,
      0,
    );
    const totalExpenses = expenses.reduce(
      (sum, account) => sum + account.balance,
      0,
    );
    const netIncome = totalRevenue - totalExpenses;

    return {
      period: { startDate, endDate },
      revenues,
      expenses,
      totalRevenue,
      totalExpenses,
      netIncome,
    };
  }

  async getBalanceSheet(branchId: number, asOfDate?: string): Promise<any> {
    const assets = await this.accountRepository.find({
      where: {
        branchId,
        accountType: AccountType.ASSET,
        isActive: true,
      },
    });

    const liabilities = await this.accountRepository.find({
      where: {
        branchId,
        accountType: AccountType.LIABILITY,
        isActive: true,
      },
    });

    const equity = await this.accountRepository.find({
      where: {
        branchId,
        accountType: AccountType.EQUITY,
        isActive: true,
      },
    });

    const totalAssets = assets.reduce(
      (sum, account) => sum + account.currentBalance,
      0,
    );
    const totalLiabilities = liabilities.reduce(
      (sum, account) => sum + account.currentBalance,
      0,
    );
    const totalEquity = equity.reduce(
      (sum, account) => sum + account.currentBalance,
      0,
    );

    return {
      asOfDate: asOfDate || new Date().toISOString(),
      assets,
      liabilities,
      equity,
      totalAssets,
      totalLiabilities,
      totalEquity,
    };
  }

  // Payment Integration
  async recordPaymentTransaction(payment: Payment): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get the appropriate accounts for this payment
      const cashAccount = await this.getCashAccount(payment.branch.branchId);
      const revenueAccount = await this.getRevenueAccount(
        payment.feeType.description,
        payment.branch.branchId,
      );

      // Create journal entries for the payment
      const journalEntries: JournalEntryLineDto[] = [
        {
          accountId: cashAccount.accountId,
          transactionType: TransactionType.DEBIT,
          amount: payment.amount,
          description: `Payment received for ${payment.feeType.description} - ${payment.student.firstname} ${payment.student.lastname}`,
        },
        {
          accountId: revenueAccount.accountId,
          transactionType: TransactionType.CREDIT,
          amount: payment.amount,
          description: `Revenue from ${payment.feeType.description} - ${payment.student.firstname} ${payment.student.lastname}`,
        },
      ];

      const createJournalEntryDto: CreateJournalEntryDto = {
        transactionDate: payment.datecreated.toISOString().split('T')[0],
        description: `Student Payment - ${payment.feeType.description}`,
        entryType: JournalEntryType.PAYMENT,
        referenceNumber: `PAY-${payment.studentfeeid}`,
        notes: `Payment for student ${payment.student.firstname} ${payment.student.lastname}`,
        branchId: payment.branch.branchId,
        paymentId: payment.studentfeeid,
        journalEntries,
      };

      await this.createJournalEntry(createJournalEntryDto);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Default Account Creation for New Branch
  async createDefaultAccountsForBranch(branchId: number): Promise<Account[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate branch exists
      const branch = await this.branchRepository.findOne({
        where: { branchId: branchId },
      });

      if (!branch) {
        throw new NotFoundException('Branch not found');
      }

      // Check if accounts already exist for this branch
      const existingAccounts = await this.accountRepository.find({
        where: { branchId: branchId },
      });

      if (existingAccounts.length > 0) {
        throw new ConflictException('Default accounts already exist for this branch');
      }

      const defaultAccounts = [
        // Asset Accounts (1000-1999)
        {
          accountNumber: `${branchId}1001`,
          accountName: 'Cash',
          description: 'Cash on hand and in bank',
          accountType: AccountType.ASSET,
          accountCategory: AccountCategory.CASH,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}1002`,
          accountName: 'Bank Account',
          description: 'Main bank account',
          accountType: AccountType.ASSET,
          accountCategory: AccountCategory.BANK,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}1003`,
          accountName: 'Accounts Receivable',
          description: 'Money owed by students and others',
          accountType: AccountType.ASSET,
          accountCategory: AccountCategory.ACCOUNTS_RECEIVABLE,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}1004`,
          accountName: 'Prepaid Expenses',
          description: 'Expenses paid in advance',
          accountType: AccountType.ASSET,
          accountCategory: AccountCategory.PREPAID_EXPENSES,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}1005`,
          accountName: 'Fixed Assets',
          description: 'School buildings, equipment, and furniture',
          accountType: AccountType.ASSET,
          accountCategory: AccountCategory.FIXED_ASSETS,
          openingBalance: 0,
          branchId: branchId,
        },

        // Liability Accounts (2000-2999)
        {
          accountNumber: `${branchId}2001`,
          accountName: 'Accounts Payable',
          description: 'Money owed to suppliers and vendors',
          accountType: AccountType.LIABILITY,
          accountCategory: AccountCategory.ACCOUNTS_PAYABLE,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}2002`,
          accountName: 'Accrued Expenses',
          description: 'Expenses incurred but not yet paid',
          accountType: AccountType.LIABILITY,
          accountCategory: AccountCategory.ACCRUED_EXPENSES,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}2003`,
          accountName: 'Loans Payable',
          description: 'Bank loans and other borrowings',
          accountType: AccountType.LIABILITY,
          accountCategory: AccountCategory.LOANS_PAYABLE,
          openingBalance: 0,
          branchId: branchId,
        },

        // Equity Accounts (3000-3999)
        {
          accountNumber: `${branchId}3001`,
          accountName: 'Owner Capital',
          description: 'Initial investment by school owners',
          accountType: AccountType.EQUITY,
          accountCategory: AccountCategory.OWNER_CAPITAL,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}3002`,
          accountName: 'Retained Earnings',
          description: 'Accumulated profits from previous years',
          accountType: AccountType.EQUITY,
          accountCategory: AccountCategory.RETAINED_EARNINGS,
          openingBalance: 0,
          branchId: branchId,
        },

        // Revenue Accounts (4000-4999)
        {
          accountNumber: `${branchId}4001`,
          accountName: 'Student Fees',
          description: 'Tuition and other student fees',
          accountType: AccountType.REVENUE,
          accountCategory: AccountCategory.STUDENT_FEES,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}4002`,
          accountName: 'Exam Fees',
          description: 'Examination and testing fees',
          accountType: AccountType.REVENUE,
          accountCategory: AccountCategory.EXAM_FEES,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}4003`,
          accountName: 'Graduation Fees',
          description: 'Graduation ceremony and certificate fees',
          accountType: AccountType.REVENUE,
          accountCategory: AccountCategory.GRADUATION_FEES,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}4004`,
          accountName: 'Other Income',
          description: 'Miscellaneous income sources',
          accountType: AccountType.REVENUE,
          accountCategory: AccountCategory.OTHER_INCOME,
          openingBalance: 0,
          branchId: branchId,
        },

        // Expense Accounts (5000-5999)
        {
          accountNumber: `${branchId}5001`,
          accountName: 'Teacher Salaries',
          description: 'Salaries and wages for teaching staff',
          accountType: AccountType.EXPENSE,
          accountCategory: AccountCategory.TEACHER_SALARIES,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}5002`,
          accountName: 'Staff Salaries',
          description: 'Salaries and wages for administrative staff',
          accountType: AccountType.EXPENSE,
          accountCategory: AccountCategory.STAFF_SALARIES,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}5003`,
          accountName: 'Maintenance',
          description: 'Building and equipment maintenance',
          accountType: AccountType.EXPENSE,
          accountCategory: AccountCategory.MAINTENANCE,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}5004`,
          accountName: 'Utilities',
          description: 'Electricity, water, internet, and phone bills',
          accountType: AccountType.EXPENSE,
          accountCategory: AccountCategory.UTILITIES,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}5005`,
          accountName: 'Rent',
          description: 'Building and property rental expenses',
          accountType: AccountType.EXPENSE,
          accountCategory: AccountCategory.RENT,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}5006`,
          accountName: 'Office Supplies',
          description: 'Stationery, books, and office materials',
          accountType: AccountType.EXPENSE,
          accountCategory: AccountCategory.OFFICE_SUPPLIES,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}5007`,
          accountName: 'Marketing',
          description: 'Advertising and promotional expenses',
          accountType: AccountType.EXPENSE,
          accountCategory: AccountCategory.MARKETING,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}5008`,
          accountName: 'Insurance',
          description: 'Property and liability insurance',
          accountType: AccountType.EXPENSE,
          accountCategory: AccountCategory.INSURANCE,
          openingBalance: 0,
          branchId: branchId,
        },
        {
          accountNumber: `${branchId}5009`,
          accountName: 'Other Expenses',
          description: 'Miscellaneous operating expenses',
          accountType: AccountType.EXPENSE,
          accountCategory: AccountCategory.OTHER_EXPENSES,
          openingBalance: 0,
          branchId: branchId,
        },
      ];

      // Create all default accounts
      const createdAccounts = [];
      for (const accountData of defaultAccounts) {
        const account = this.accountRepository.create({
          ...accountData,
          currentBalance: accountData.openingBalance,
        });
        const savedAccount = await queryRunner.manager.save(account);
        createdAccounts.push(savedAccount);
      }

      await queryRunner.commitTransaction();
      return createdAccounts;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error creating default accounts: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // Helper Methods
  private validateDoubleEntry(journalEntries: JournalEntryLineDto[]): void {
    const totalDebits = journalEntries
      .filter((entry) => entry.transactionType === TransactionType.DEBIT)
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalCredits = journalEntries
      .filter((entry) => entry.transactionType === TransactionType.CREDIT)
      .reduce((sum, entry) => sum + entry.amount, 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      throw new BadRequestException(
        `Debits (${totalDebits}) must equal credits (${totalCredits})`,
      );
    }
  }

  private calculateTotalAmount(journalEntries: JournalEntryLineDto[]): number {
    return journalEntries.reduce((sum, entry) => sum + entry.amount, 0);
  }

  private async generateTransactionNumber(branchId: number): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    const lastTransaction = await this.transactionRepository.findOne({
      where: { branchId },
      order: { transactionId: 'DESC' },
    });

    let sequence = 1;
    if (lastTransaction) {
      const lastNumber = lastTransaction.transactionNumber;
      const lastSequence = parseInt(lastNumber.slice(-4));
      sequence = lastSequence + 1;
    }

    return `TXN-${branchId}-${dateStr}-${sequence.toString().padStart(4, '0')}`;
  }

  private async updateAccountBalances(
    queryRunner: any,
    journalEntries: JournalEntryLineDto[],
  ): Promise<void> {
    for (const entry of journalEntries) {
      const account = await queryRunner.manager.findOne(Account, {
        where: { accountId: entry.accountId },
      });

      if (!account) {
        throw new NotFoundException(`Account ${entry.accountId} not found`);
      }

      if (entry.transactionType === TransactionType.DEBIT) {
        if (
          account.accountType === AccountType.ASSET ||
          account.accountType === AccountType.EXPENSE
        ) {
          account.currentBalance += entry.amount;
        } else {
          account.currentBalance -= entry.amount;
        }
      } else {
        if (
          account.accountType === AccountType.ASSET ||
          account.accountType === AccountType.EXPENSE
        ) {
          account.currentBalance -= entry.amount;
        } else {
          account.currentBalance += entry.amount;
        }
      }

      await queryRunner.manager.save(account);
    }
  }

  private async createOpeningBalanceEntry(
    queryRunner: any,
    account: Account,
    openingBalance: number,
  ): Promise<void> {
    // Find the opening balance equity account
    const equityAccount = await queryRunner.manager.findOne(Account, {
      where: {
        branchId: account.branchId,
        accountCategory: AccountCategory.OWNER_CAPITAL,
      },
    });

    if (!equityAccount) {
      throw new NotFoundException('Opening balance equity account not found');
    }

    const journalEntries: JournalEntryLineDto[] = [
      {
        accountId: account.accountId,
        transactionType: TransactionType.DEBIT,
        amount: openingBalance,
        description: 'Opening balance',
      },
      {
        accountId: equityAccount.accountId,
        transactionType: TransactionType.CREDIT,
        amount: openingBalance,
        description: 'Opening balance',
      },
    ];

    const createJournalEntryDto: CreateJournalEntryDto = {
      transactionDate: new Date().toISOString().split('T')[0],
      description: `Opening balance for ${account.accountName}`,
      entryType: JournalEntryType.ADJUSTMENT,
      referenceNumber: `OB-${account.accountNumber}`,
      notes: 'Opening balance entry',
      branchId: account.branchId,
      journalEntries,
    };

    await this.createJournalEntry(createJournalEntryDto);
  }

  private async getCashAccount(branchId: number): Promise<Account> {
    const cashAccount = await this.accountRepository.findOne({
      where: {
        branchId,
        accountCategory: AccountCategory.CASH,
        isActive: true,
      },
    });

    if (!cashAccount) {
      throw new NotFoundException('Cash account not found for this branch');
    }

    return cashAccount;
  }

  private async getRevenueAccount(
    feeType: string,
    branchId: number,
  ): Promise<Account> {
    let accountCategory: AccountCategory;

    switch (feeType.toLowerCase()) {
      case 'class fee':
        accountCategory = AccountCategory.STUDENT_FEES;
        break;
      case 'exam fee':
        accountCategory = AccountCategory.EXAM_FEES;
        break;
      case 'graduation fee':
        accountCategory = AccountCategory.GRADUATION_FEES;
        break;
      default:
        accountCategory = AccountCategory.OTHER_INCOME;
    }

    const revenueAccount = await this.accountRepository.findOne({
      where: {
        branchId,
        accountCategory,
        isActive: true,
      },
    });

    if (!revenueAccount) {
      throw new NotFoundException(`Revenue account for ${feeType} not found`);
    }

    return revenueAccount;
  }

  private async calculateAccountBalances(
    accounts: Account[],
    startDate: string,
    endDate: string,
  ): Promise<any[]> {
    const result = [];

    for (const account of accounts) {
      const balance = await this.journalEntryRepository
        .createQueryBuilder('journalEntry')
        .select(
          'SUM(CASE WHEN journalEntry.transactionType = :debit THEN journalEntry.amount ELSE -journalEntry.amount END)',
          'balance',
        )
        .where('journalEntry.accountId = :accountId', {
          accountId: account.accountId,
        })
        .andWhere(
          'DATE(journalEntry.transactionDate) BETWEEN :startDate AND :endDate',
          {
            startDate,
            endDate,
          },
        )
        .setParameter('debit', TransactionType.DEBIT)
        .getRawOne();

      result.push({
        accountId: account.accountId,
        accountNumber: account.accountNumber,
        accountName: account.accountName,
        balance: parseFloat(balance?.balance || '0'),
      });
    }

    return result;
  }
}
