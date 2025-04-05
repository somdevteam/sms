import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { Paymenttypes } from "./entities/paymenttype.entity";
import { Months } from "../../common/months.entity";
import { PaymentStates } from "./entities/paymentstates.entity";
import { StudentClass } from '../studentModule/student/entities/student-class.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Payment,Paymenttypes,Months,PaymentStates,StudentClass])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
