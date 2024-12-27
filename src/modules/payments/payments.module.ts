import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { Paymenttypes } from "./entities/paymenttype.entity";
import { Months } from "../../common/months.entity";
import { StudentclassModule } from "../studentModule/studentclass/studentclass.module";
import { PaymentStates } from "./entities/paymentstates.entity";
import { Feetypes } from "./entities/feetypes.entity";
import { Responsible } from "../studentModule/responsible/entities/responsible.entity";


@Module({
  imports: [TypeOrmModule.forFeature([Payment,Paymenttypes,Months,PaymentStates,Feetypes,Responsible]),StudentclassModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
