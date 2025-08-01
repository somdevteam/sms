import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccountingService } from './accounting.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApiBaseResponse } from '../../common/dto/apiresponses.dto';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';

export class ReportFilterDto {
  @IsNotEmpty({ message: 'Branch ID is required' })
  @IsNumber()
  branchId: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  asOfDate?: string;
}

@ApiTags('Accounting')
@Controller('accounting')
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  // Account Management Endpoints
  @Post('accounts')
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<ApiBaseResponse> {
    const account = await this.accountingService.createAccount(
      createAccountDto,
    );
    return new ApiBaseResponse('Account created successfully', 201, account);
  }

  @Get('accounts')
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully' })
  async findAllAccounts(
    @Query('branchId') branchId?: number,
  ): Promise<ApiBaseResponse> {
    const accounts = await this.accountingService.findAllAccounts(branchId);
    return new ApiBaseResponse(
      'Accounts retrieved successfully',
      200,
      accounts,
    );
  }

  @Get('accounts/:id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiResponse({ status: 200, description: 'Account retrieved successfully' })
  async findAccountById(@Param('id') id: string): Promise<ApiBaseResponse> {
    const account = await this.accountingService.findAccountById(+id);
    return new ApiBaseResponse('Account retrieved successfully', 200, account);
  }

  @Patch('accounts/:id')
  @ApiOperation({ summary: 'Update account' })
  @ApiResponse({ status: 200, description: 'Account updated successfully' })
  async updateAccount(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<ApiBaseResponse> {
    const account = await this.accountingService.updateAccount(
      +id,
      updateAccountDto,
    );
    return new ApiBaseResponse('Account updated successfully', 200, account);
  }

  @Delete('accounts/:id')
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  async deleteAccount(@Param('id') id: string): Promise<ApiBaseResponse> {
    await this.accountingService.deleteAccount(+id);
    return new ApiBaseResponse('Account deleted successfully', 200, null);
  }

  @Post('accounts/default/:branchId')
  @ApiOperation({ summary: 'Create default accounts for a new branch' })
  @ApiResponse({
    status: 201,
    description: 'Default accounts created successfully',
  })
  async createDefaultAccountsForBranch(
    @Param('branchId') branchId: string,
  ): Promise<ApiBaseResponse> {
    const accounts =
      await this.accountingService.createDefaultAccountsForBranch(+branchId);
    return new ApiBaseResponse(
      'Default accounts created successfully',
      201,
      accounts,
    );
  }

  // Journal Entry Endpoints
  @Post('journal-entries')
  @ApiOperation({ summary: 'Create a new journal entry' })
  @ApiResponse({
    status: 201,
    description: 'Journal entry created successfully',
  })
  async createJournalEntry(
    @Body() createJournalEntryDto: CreateJournalEntryDto,
  ): Promise<ApiBaseResponse> {
    const transaction = await this.accountingService.createJournalEntry(
      createJournalEntryDto,
    );
    return new ApiBaseResponse(
      'Journal entry created successfully',
      201,
      transaction,
    );
  }

  @Get('journal-entries')
  @ApiOperation({ summary: 'Get all journal entries' })
  @ApiResponse({
    status: 200,
    description: 'Journal entries retrieved successfully',
  })
  async findAllJournalEntries(
    @Query('branchId') branchId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ApiBaseResponse> {
    const journalEntries = await this.accountingService.findAllJournalEntries(
      branchId,
      startDate,
      endDate,
    );
    return new ApiBaseResponse(
      'Journal entries retrieved successfully',
      200,
      journalEntries,
    );
  }

  // Financial Reports Endpoints
  @Post('reports/trial-balance')
  @ApiOperation({ summary: 'Generate trial balance report' })
  @ApiResponse({
    status: 200,
    description: 'Trial balance generated successfully',
  })
  async getTrialBalance(
    @Body() filterDto: ReportFilterDto,
  ): Promise<ApiBaseResponse> {
    if (!this.isValidDate(filterDto.asOfDate)) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }

    const trialBalance = await this.accountingService.getTrialBalance(
      filterDto.branchId,
      filterDto.asOfDate,
    );
    return new ApiBaseResponse(
      'Trial balance generated successfully',
      200,
      trialBalance,
    );
  }

  @Post('reports/income-statement')
  @ApiOperation({ summary: 'Generate income statement report' })
  @ApiResponse({
    status: 200,
    description: 'Income statement generated successfully',
  })
  async getIncomeStatement(
    @Body() filterDto: ReportFilterDto,
  ): Promise<ApiBaseResponse> {
    if (!filterDto.startDate || !filterDto.endDate) {
      throw new BadRequestException(
        'Start date and end date are required for income statement',
      );
    }

    if (
      !this.isValidDate(filterDto.startDate) ||
      !this.isValidDate(filterDto.endDate)
    ) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }

    if (new Date(filterDto.endDate) < new Date(filterDto.startDate)) {
      throw new BadRequestException('End date cannot be before start date');
    }

    const incomeStatement = await this.accountingService.getIncomeStatement(
      filterDto.branchId,
      filterDto.startDate,
      filterDto.endDate,
    );
    return new ApiBaseResponse(
      'Income statement generated successfully',
      200,
      incomeStatement,
    );
  }

  @Post('reports/balance-sheet')
  @ApiOperation({ summary: 'Generate balance sheet report' })
  @ApiResponse({
    status: 200,
    description: 'Balance sheet generated successfully',
  })
  async getBalanceSheet(
    @Body() filterDto: ReportFilterDto,
  ): Promise<ApiBaseResponse> {
    if (filterDto.asOfDate && !this.isValidDate(filterDto.asOfDate)) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }

    const balanceSheet = await this.accountingService.getBalanceSheet(
      filterDto.branchId,
      filterDto.asOfDate,
    );
    return new ApiBaseResponse(
      'Balance sheet generated successfully',
      200,
      balanceSheet,
    );
  }

  // Account Types and Categories
  @Get('account-types')
  @ApiOperation({ summary: 'Get all account types' })
  @ApiResponse({
    status: 200,
    description: 'Account types retrieved successfully',
  })
  async getAccountTypes(): Promise<ApiBaseResponse> {
    const accountTypes = [
      { value: 'ASSET', label: 'Asset' },
      { value: 'LIABILITY', label: 'Liability' },
      { value: 'EQUITY', label: 'Equity' },
      { value: 'REVENUE', label: 'Revenue' },
      { value: 'EXPENSE', label: 'Expense' },
    ];
    return new ApiBaseResponse(
      'Account types retrieved successfully',
      200,
      accountTypes,
    );
  }

  @Get('account-categories')
  @ApiOperation({ summary: 'Get all account categories' })
  @ApiResponse({
    status: 200,
    description: 'Account categories retrieved successfully',
  })
  async getAccountCategories(): Promise<ApiBaseResponse> {
    const accountCategories = [
      // Asset Accounts
      { value: 'CASH', label: 'Cash', type: 'ASSET' },
      { value: 'BANK', label: 'Bank', type: 'ASSET' },
      {
        value: 'ACCOUNTS_RECEIVABLE',
        label: 'Accounts Receivable',
        type: 'ASSET',
      },
      { value: 'INVENTORY', label: 'Inventory', type: 'ASSET' },
      { value: 'FIXED_ASSETS', label: 'Fixed Assets', type: 'ASSET' },
      { value: 'PREPAID_EXPENSES', label: 'Prepaid Expenses', type: 'ASSET' },

      // Liability Accounts
      {
        value: 'ACCOUNTS_PAYABLE',
        label: 'Accounts Payable',
        type: 'LIABILITY',
      },
      { value: 'LOANS_PAYABLE', label: 'Loans Payable', type: 'LIABILITY' },
      {
        value: 'ACCRUED_EXPENSES',
        label: 'Accrued Expenses',
        type: 'LIABILITY',
      },

      // Equity Accounts
      { value: 'OWNER_CAPITAL', label: 'Owner Capital', type: 'EQUITY' },
      {
        value: 'RETAINED_EARNINGS',
        label: 'Retained Earnings',
        type: 'EQUITY',
      },

      // Revenue Accounts
      { value: 'STUDENT_FEES', label: 'Student Fees', type: 'REVENUE' },
      { value: 'EXAM_FEES', label: 'Exam Fees', type: 'REVENUE' },
      { value: 'GRADUATION_FEES', label: 'Graduation Fees', type: 'REVENUE' },
      { value: 'OTHER_INCOME', label: 'Other Income', type: 'REVENUE' },

      // Expense Accounts
      { value: 'TEACHER_SALARIES', label: 'Teacher Salaries', type: 'EXPENSE' },
      { value: 'STAFF_SALARIES', label: 'Staff Salaries', type: 'EXPENSE' },
      { value: 'MAINTENANCE', label: 'Maintenance', type: 'EXPENSE' },
      { value: 'UTILITIES', label: 'Utilities', type: 'EXPENSE' },
      { value: 'RENT', label: 'Rent', type: 'EXPENSE' },
      { value: 'OFFICE_SUPPLIES', label: 'Office Supplies', type: 'EXPENSE' },
      { value: 'MARKETING', label: 'Marketing', type: 'EXPENSE' },
      { value: 'INSURANCE', label: 'Insurance', type: 'EXPENSE' },
      { value: 'OTHER_EXPENSES', label: 'Other Expenses', type: 'EXPENSE' },
    ];
    return new ApiBaseResponse(
      'Account categories retrieved successfully',
      200,
      accountCategories,
    );
  }

  // Transaction Types
  @Get('transaction-types')
  @ApiOperation({ summary: 'Get all transaction types' })
  @ApiResponse({
    status: 200,
    description: 'Transaction types retrieved successfully',
  })
  async getTransactionTypes(): Promise<ApiBaseResponse> {
    const transactionTypes = [
      { value: 'DEBIT', label: 'Debit' },
      { value: 'CREDIT', label: 'Credit' },
    ];
    return new ApiBaseResponse(
      'Transaction types retrieved successfully',
      200,
      transactionTypes,
    );
  }

  // Journal Entry Types
  @Get('journal-entry-types')
  @ApiOperation({ summary: 'Get all journal entry types' })
  @ApiResponse({
    status: 200,
    description: 'Journal entry types retrieved successfully',
  })
  async getJournalEntryTypes(): Promise<ApiBaseResponse> {
    const journalEntryTypes = [
      { value: 'MANUAL', label: 'Manual Entry' },
      { value: 'PAYMENT', label: 'Payment' },
      { value: 'EXPENSE', label: 'Expense' },
      { value: 'ADJUSTMENT', label: 'Adjustment' },
    ];
    return new ApiBaseResponse(
      'Journal entry types retrieved successfully',
      200,
      journalEntryTypes,
    );
  }

  private isValidDate(dateString: string): boolean {
    if (!dateString) return true;
    const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    return regex.test(dateString) && !isNaN(new Date(dateString).getTime());
  }

  @Get('expense-categories')
  async getExpenseCategories(): Promise<ApiBaseResponse> {
    const categories = [
      { value: 'SALARY', label: 'Salary' },
      { value: 'SUPPLIES', label: 'Supplies' },
      { value: 'UTILITIES', label: 'Utilities' },
      { value: 'MAINTENANCE', label: 'Maintenance' },
      { value: 'MARKETING', label: 'Marketing' },
      { value: 'RENT', label: 'Rent' },
      { value: 'INSURANCE', label: 'Insurance' },
      { value: 'OTHER', label: 'Other' },
    ];
    return new ApiBaseResponse(
      'Expense categories retrieved successfully',
      200,
      categories,
    );
  }

  @Get('payment-methods')
  async getPaymentMethods(): Promise<ApiBaseResponse> {
    const methods = [
      { value: 'CASH', label: 'Cash' },
      { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
      { value: 'CHECK', label: 'Check' },
      { value: 'CREDIT_CARD', label: 'Credit Card' },
      { value: 'DEBIT_CARD', label: 'Debit Card' },
    ];
    return new ApiBaseResponse(
      'Payment methods retrieved successfully',
      200,
      methods,
    );
  }

  // Expense Management Endpoints
  @Post('expenses')
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense created successfully' })
  async createExpense(
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<ApiBaseResponse> {
    const expense = await this.accountingService.createExpense(
      createExpenseDto,
    );
    return new ApiBaseResponse('Expense created successfully', 201, expense);
  }

  @Get('expenses')
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiResponse({ status: 200, description: 'Expenses retrieved successfully' })
  async findAllExpenses(
    @Query('branchId') branchId?: number,
  ): Promise<ApiBaseResponse> {
    const expenses = await this.accountingService.findAllExpenses(branchId);
    return new ApiBaseResponse(
      'Expenses retrieved successfully',
      200,
      expenses,
    );
  }

  @Get('expenses/:id')
  @ApiOperation({ summary: 'Get expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense retrieved successfully' })
  async findExpenseById(@Param('id') id: string): Promise<ApiBaseResponse> {
    const expense = await this.accountingService.findExpenseById(+id);
    return new ApiBaseResponse('Expense retrieved successfully', 200, expense);
  }

  @Patch('expenses/:id')
  @ApiOperation({ summary: 'Update expense' })
  @ApiResponse({ status: 200, description: 'Expense updated successfully' })
  async updateExpense(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<ApiBaseResponse> {
    const expense = await this.accountingService.updateExpense(
      +id,
      updateExpenseDto,
    );
    return new ApiBaseResponse('Expense updated successfully', 200, expense);
  }

  @Delete('expenses/:id')
  @ApiOperation({ summary: 'Delete expense' })
  @ApiResponse({ status: 200, description: 'Expense deleted successfully' })
  async deleteExpense(@Param('id') id: string): Promise<ApiBaseResponse> {
    await this.accountingService.deleteExpense(+id);
    return new ApiBaseResponse('Expense deleted successfully', 200, null);
  }

  @Post('expenses/:id/approve')
  @ApiOperation({ summary: 'Approve expense' })
  @ApiResponse({ status: 200, description: 'Expense approved successfully' })
  async approveExpense(@Param('id') id: string): Promise<ApiBaseResponse> {
    const expense = await this.accountingService.approveExpense(+id);
    return new ApiBaseResponse('Expense approved successfully', 200, expense);
  }

  @Post('expenses/:id/pay')
  @ApiOperation({ summary: 'Pay expense' })
  @ApiResponse({ status: 200, description: 'Expense paid successfully' })
  async payExpense(@Param('id') id: string): Promise<ApiBaseResponse> {
    const expense = await this.accountingService.payExpense(+id);
    return new ApiBaseResponse('Expense paid successfully', 200, expense);
  }

  @Get('expense-accounts')
  @ApiOperation({ summary: 'Get expense accounts for branch' })
  @ApiResponse({
    status: 200,
    description: 'Expense accounts retrieved successfully',
  })
  async getExpenseAccounts(
    @Query('branchId') branchId: number,
  ): Promise<ApiBaseResponse> {
    const accounts = await this.accountingService.getExpenseAccounts(branchId);
    return new ApiBaseResponse(
      'Expense accounts retrieved successfully',
      200,
      accounts,
    );
  }

  @Get('payment-accounts')
  @ApiOperation({ summary: 'Get payment accounts for branch' })
  @ApiResponse({
    status: 200,
    description: 'Payment accounts retrieved successfully',
  })
  async getPaymentAccounts(
    @Query('branchId') branchId: number,
  ): Promise<ApiBaseResponse> {
    const accounts = await this.accountingService.getPaymentAccounts(branchId);
    return new ApiBaseResponse(
      'Payment accounts retrieved successfully',
      200,
      accounts,
    );
  }

  @Get('cash-position')
  @ApiOperation({ summary: 'Get current cash position' })
  @ApiResponse({
    status: 200,
    description: 'Cash position retrieved successfully',
  })
  async getCashPosition(
    @Query('branchId') branchId: number,
  ): Promise<ApiBaseResponse> {
    const cashPosition = await this.accountingService.getCashPosition(branchId);
    return new ApiBaseResponse(
      'Cash position retrieved successfully',
      200,
      cashPosition,
    );
  }

  @Get('financial-position')
  @ApiOperation({ summary: 'Get comprehensive financial position' })
  @ApiResponse({
    status: 200,
    description: 'Financial position retrieved successfully',
  })
  async getFinancialPosition(
    @Query('branchId') branchId: number,
  ): Promise<ApiBaseResponse> {
    const financialPosition = await this.accountingService.getFinancialPosition(
      branchId,
    );
    return new ApiBaseResponse(
      'Financial position retrieved successfully',
      200,
      financialPosition,
    );
  }
}
