import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';
import { Paymenttypes } from './entities/paymenttype.entity';
import { PaymentStates } from './entities/paymentstates.entity';
import { Months } from '../../common/months.entity';
import { Feetypes } from './entities/feetypes.entity';
import { Responsible } from '../studentModule/responsible/entities/responsible.entity';
import { StudentclassModule } from '../studentModule/studentclass/studentclass.module';
import { StudentModule } from '../studentModule/student/student.module';
import { PaymentChargeRequest } from './entities/payment-charge-request.entity';
import { PaymentChargeRequestService } from './payment-charge-request.service';
import { PaymentChargeRequestController } from './payment-charge-request.controller';
import { Student } from '../studentModule/student/entities/student.entity';
import { StudentClass } from '../studentModule/studentclass/entities/studentclass.entity';
import { ChargeType } from './entities/charge-type.entity';
import { Branch } from '../branch/branch.entity';
import { AccountingModule } from '../accounting/accounting.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      Paymenttypes,
      PaymentStates,
      Months,
      Feetypes,
      Responsible,
      PaymentChargeRequest,
      Student,
      StudentClass,
      ChargeType,
      Branch,
    ]),
    StudentclassModule,
    StudentModule,
    AccountingModule,
  ],
  controllers: [PaymentsController, PaymentChargeRequestController],
  providers: [PaymentsService, PaymentChargeRequestService],
  exports: [PaymentsService, PaymentChargeRequestService],
})
export class PaymentsModule {}
