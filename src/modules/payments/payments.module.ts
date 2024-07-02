import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { Paymenttypes } from "./entities/paymenttype.entity";
import { Months } from "../../common/months.entity";


@Module({
  imports: [TypeOrmModule.forFeature([Payment,Paymenttypes,Months])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
