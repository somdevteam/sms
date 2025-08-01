import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingService } from './accounting.service';
import { AccountingController } from './accounting.controller';
import { AccountingSeedService } from './accounting-seed.service';
import { Account } from './entities/account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { Transaction } from './entities/transaction.entity';
import { Expense } from './entities/expense.entity';
import { Branch } from '../branch/branch.entity';
import { Payment } from '../payments/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      JournalEntry,
      Transaction,
      Expense,
      Branch,
      Payment,
    ]),
  ],
  controllers: [AccountingController],
  providers: [AccountingService, AccountingSeedService],
  exports: [AccountingService, AccountingSeedService],
})
export class AccountingModule {}
