import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
  Min,
} from 'class-validator';
import { AccountType, AccountCategory } from '../entities/account.entity';

export class CreateAccountDto {
  @ApiProperty({ description: 'Account number (must be unique)' })
  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @ApiProperty({ description: 'Account name' })
  @IsNotEmpty()
  @IsString()
  accountName: string;

  @ApiProperty({ description: 'Account description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Account type', enum: AccountType })
  @IsNotEmpty()
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiProperty({ description: 'Account category', enum: AccountCategory })
  @IsNotEmpty()
  @IsEnum(AccountCategory)
  accountCategory: AccountCategory;

  @ApiProperty({ description: 'Opening balance', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  openingBalance?: number;

  @ApiProperty({ description: 'Branch ID' })
  @IsNotEmpty()
  @IsNumber()
  branchId: number;

  @ApiProperty({ description: 'Account active status', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
