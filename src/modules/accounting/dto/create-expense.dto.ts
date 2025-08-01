import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  ExpenseCategory,
  PaymentMethod,
  ExpenseStatus,
} from '../entities/expense.entity';

export class CreateExpenseDto {
  @ApiProperty({ description: 'Expense date', example: '2024-01-15' })
  @IsNotEmpty({ message: 'Expense date is required' })
  @IsDateString()
  expenseDate: string;

  @ApiProperty({
    description: 'Expense description',
    example: 'Teacher Salary - January 2024',
  })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Expense amount', example: 5000.0 })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @ApiProperty({
    description: 'Expense category',
    enum: ExpenseCategory,
    example: ExpenseCategory.TEACHER_SALARIES,
  })
  @IsNotEmpty({ message: 'Expense category is required' })
  @IsEnum(ExpenseCategory)
  expenseCategory: ExpenseCategory;

  @ApiProperty({
    description: 'Vendor name',
    example: 'Teacher Staff',
    required: false,
  })
  @IsOptional()
  @IsString()
  vendorName?: string;

  @ApiProperty({
    description: 'Invoice number',
    example: 'INV-2024-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.BANK_TRANSFER,
  })
  @IsNotEmpty({ message: 'Payment method is required' })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Expense status',
    enum: ExpenseStatus,
    example: ExpenseStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ExpenseStatus)
  status?: ExpenseStatus;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Receipt number', required: false })
  @IsOptional()
  @IsString()
  receiptNumber?: string;

  @ApiProperty({ description: 'Branch ID', example: 1 })
  @IsNotEmpty({ message: 'Branch ID is required' })
  @IsNumber()
  branchId: number;

  @ApiProperty({
    description: 'Expense account ID (the account to debit)',
    example: 1,
  })
  @IsNotEmpty({ message: 'Expense account ID is required' })
  @IsNumber()
  expenseAccountId: number;

  @ApiProperty({
    description: 'Payment account ID (the account to credit)',
    example: 2,
  })
  @IsNotEmpty({ message: 'Payment account ID is required' })
  @IsNumber()
  paymentAccountId: number;
}
