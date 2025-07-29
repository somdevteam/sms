import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TransactionType,
  JournalEntryType,
} from '../entities/journal-entry.entity';

export class JournalEntryLineDto {
  @ApiProperty({ description: 'Account ID' })
  @IsNotEmpty()
  @IsNumber()
  accountId: number;

  @ApiProperty({ description: 'Transaction type', enum: TransactionType })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiProperty({ description: 'Amount' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Description for this line' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class CreateJournalEntryDto {
  @ApiProperty({ description: 'Transaction date' })
  @IsNotEmpty()
  @IsDateString()
  transactionDate: string;

  @ApiProperty({ description: 'Overall transaction description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Journal entry type', enum: JournalEntryType })
  @IsOptional()
  @IsEnum(JournalEntryType)
  entryType?: JournalEntryType;

  @ApiProperty({ description: 'Reference number', required: false })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Branch ID' })
  @IsNotEmpty()
  @IsNumber()
  branchId: number;

  @ApiProperty({
    description: 'Payment ID (if related to payment)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  paymentId?: number;

  @ApiProperty({
    description: 'Journal entry lines',
    type: [JournalEntryLineDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JournalEntryLineDto)
  journalEntries: JournalEntryLineDto[];
}
