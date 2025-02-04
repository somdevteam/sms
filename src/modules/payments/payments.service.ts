import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException
} from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { Repository } from "typeorm";
import { Branch } from "../branch/branch.entity";
import { Paymenttypes } from "./entities/paymenttype.entity";
import { ClassSectionService } from "../academicModule/class-section/class-section.service";
import { StudentClassService } from "../studentModule/studentclass/studentclass.service";
import { PaymentStates } from "./entities/paymentstates.entity";
import { Months } from "../../common/months.entity";
import { Feetypes } from "./entities/feetypes.entity";
import { Responsible } from "../studentModule/responsible/entities/responsible.entity";
import { StudentService } from "../studentModule/student/student.service";
import { createFullName } from "../../common/enum/sms.enum";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(Paymenttypes) private paymentTypesRepository: Repository<Paymenttypes>,
    @InjectRepository(PaymentStates) private paymentStateRepository: Repository<PaymentStates>,
    @InjectRepository(Months) private monthsRepository: Repository<Months>,
    @InjectRepository(Feetypes) private feeTypesRepository: Repository<Feetypes>,
    @InjectRepository(Responsible) private responsibleRepository: Repository<Responsible>,
    private readonly studentClassService: StudentClassService,
    private readonly studentService: StudentService,
  ) {
  }

  // async create(payload: CreatePaymentDto) {
  //
  //   const feeTypeId = await this.paymentTypesRepository.findOne({ where: { paymenttypeid: payload.paymentTypeId } });
  //   const feeStateId = await this.paymentStateRepository.findOne({ where: { paymentstateid: payload.paymentStateId } });
  //   const studentClassId = await this.studentClassService.findOne(payload.studentClassId);
  //
  //   const currentMonth = payload.monthName; // assuming monthName is a string like 'July', 'August', etc.
  //   const currentYear = new Date().getFullYear();
  //
  //   // Check if the student has already paid the fee for the current month and year
  //   const existingPayment = await this.paymentRepository.findOne({
  //     where: {
  //       studentClass:payload.studentClassId,
  //       monthName: currentMonth,
  //       datecreated: new Date(currentYear, new Date().getMonth(), 1),
  //     },
  //   });
  //
  //   if (existingPayment) {
  //     throw new ConflictException('Fee for this month and year has already been registered.');
  //   }
  //
  //   if (feeTypeId.amount != payload.amount){
  //     throw new ConflictException('Misconfigured Amounts');
  //   }
  //
  //   try {
  //     let payment = new Payment();
  //     payment.studentClass = studentClassId;
  //     payment.monthName = payload.monthName;
  //     payment.studentFeeType = feeTypeId;
  //     payment.paymentStateId =feeStateId;
  //     payment.amount = payload.amount;
  //     payment.datecreated = new Date();
  //     return await this.paymentRepository.save(payment);
  //   } catch (error) {
  //     if (error) {
  //       throw new ConflictException(
  //         "The provided branch name is already associated." + error.messages
  //       );
  //     }
  //     throw new InternalServerErrorException(
  //       "An error occurred while creating the branch."
  //     );
  //   }
  // }

  async create(payload: CreatePaymentDto) {
    const feeTypeId = await this.paymentTypesRepository.findOne({ where: { paymenttypeid: payload.paymentTypeId } });
    const feeStateId = await this.paymentStateRepository.findOne({ where: { paymentstateid: payload.paymentStateId } });
    const studentClass = await this.studentClassService.findOne(payload.studentClassId);
    const monthData = await this.monthsRepository.findOne({ where: { monthid: payload.monthId } });
    const responsibleId  = await this.responsibleRepository.findOne({where:{responsibleid:payload.responsibleId}});

    if (!feeTypeId || !feeStateId || !studentClass) {
      throw new ConflictException('Invalid references provided.');
    }

    if (Number(feeTypeId.amount) !== payload.amount) {
      throw new ConflictException('Misconfigured Amounts');
    }

    if (monthData.monthid !== payload.monthId) {
      throw new ConflictException('Misconfigured Months');
    }


    await this.validatePaymentNotExists(studentClass.studentClassId, payload.monthName);

    try {
      const payment = new Payment();
      payment.studentClass = studentClass;
      payment.monthName = payload.monthName;
      payment.studentFeeType = feeTypeId;
      payment.paymentStateId = feeStateId;
      payment.amount = payload.amount;
      payment.datecreated = new Date();
      payment.responsibleId = responsibleId;
      payment.rollNo = payload.rollNo;

      return await this.paymentRepository.save(payment);
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while creating the payment: ' + (error.message || error),
      );
    }
  }

  private async validatePaymentNotExists(studentClassId: number, monthName: string): Promise<void> {
    const currentYear = new Date().getFullYear();

    const existingPayment = await this.paymentRepository.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.studentClass', 'studentClass')
      .where('studentClass.studentClassId = :studentClassId', { studentClassId })
      .andWhere('payment.monthName = :monthName', { monthName })
      .andWhere('YEAR(payment.datecreated) = :year', { year: currentYear })
      .getOne();

    if (existingPayment) {
      throw new ConflictException('Fee for this month and year has already been paid.');
    }
  }

  async getPayments(date?: string, rollNumber?: number): Promise<Payment[]> {
    try {
      const queryBuilder = this.paymentRepository.createQueryBuilder('payment')
        .leftJoinAndSelect('payment.studentClass', 'studentClass')
        .leftJoinAndSelect('studentClass.student', 'student')
        .leftJoinAndSelect('studentClass.classSection', 'classSection')
        .leftJoinAndSelect('payment.studentFeeType', 'feeType')
        .leftJoinAndSelect('payment.paymentStateId', 'paymentState');

      if (date) {
        queryBuilder.andWhere('DATE(payment.datecreated) = :date', { date });
      }

      if (rollNumber) {
        queryBuilder.andWhere('student.rollNumber = :rollNumber', { rollNumber });
      }

      const payments = await queryBuilder.getMany();

      if (!payments || payments.length === 0) {
        throw new NotFoundException('No payments found matching the criteria');
      }

      return payments;
    } catch (error) {
      throw new NotFoundException(`Error fetching payments: ${error.message}`);
    }
  }

  findAll() {
    return `This action returns all payments`;
  }

  async findAllPaymentTypes() {
    return await this.paymentTypesRepository.find();
  }

  async findAllPaymentStates() {
    return await this.paymentStateRepository.find();
  }

  async findAllFeeTypes():Promise<Feetypes[]> {
    return await this.feeTypesRepository.find();
  }

  async findAllMonths() {
    return await this.monthsRepository.find({
      order: {
        monthid: 'ASC',
      },
    });
  }
  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }

  async createMultiple(paymentDtos: CreatePaymentDto[]): Promise<{ payments: Payment[]; receipts: any[] }> {
    const paymentEntities = [];

    for (const paymentDto of paymentDtos) {
      // Validate references and business logic
      const feeType = await this.paymentTypesRepository.findOne({ where: { paymenttypeid: paymentDto.paymentTypeId } });
      const feeState = await this.paymentStateRepository.findOne({ where: { paymentstateid: paymentDto.paymentStateId } });
      const studentClass = await this.studentClassService.findOne(paymentDto.studentClassId);

      if (!feeType || !feeState || !studentClass) {
        throw new ConflictException("Invalid references provided.");
      }

      await this.validatePaymentNotExists(studentClass.studentClassId, paymentDto.monthName);

      // Prepare payment entity
      const payment = new Payment();
      payment.studentClass = studentClass;
      payment.monthName = paymentDto.monthName;
      payment.studentFeeType = feeType;
      payment.paymentStateId = feeState;
      payment.student = await  this.studentService.findOne(paymentDto.studentId);
      payment.amount = paymentDto.amount;
      payment.datecreated = new Date();
      payment.responsibleId = await this.responsibleRepository.findOne({ where: { responsibleid: paymentDto.responsibleId } });
      payment.rollNo = paymentDto.rollNo;

      paymentEntities.push(payment);
    }

    // Save all payments in a single transaction
    try {
       const savedPayments = await this.paymentRepository.save(paymentEntities);
      // let paymentInfo = {
      //   fullname: createFullName(savedPayments[0].student.firstname,savedPayments[0].student.middlename,savedPayments[0].student.lastname),
      //   monthName: savedPayments[0].monthName,
      //   paymentState: savedPayments[0].paymentStateId.description,
      //   amount:savedPayments[0].amount,
      //   rollNo:savedPayments[0].student.rollNumber,
      //   dateCreated: savedPayments[0].dateCreated,
      //   responsibleName : savedPayments[0].responsibleId.responsiblename
      // };
      // let receipt = {
      //   fullname: createFullName(
      //     savedPayments[0].student.firstname,
      //     savedPayments[0].student.middlename,
      //     savedPayments[0].student.lastname
      //   ),
      //   monthName: savedPayments[0].monthName,
      //   paymentState: savedPayments[0].paymentStateId.description,
      //   amount: savedPayments[0].amount,
      //   rollNo: savedPayments[0].student.rollNumber,
      //   dateCreated: savedPayments[0].datecreated,
      //   responsibleName: savedPayments[0].responsibleId.responsiblename,
      // };
      let receipts = savedPayments.map(payment => ({
        fullname: createFullName(
          payment.student.firstname,
          payment.student.middlename,
          payment.student.lastname
        ),
        monthName: payment.monthName,
        paymentState: payment.paymentStateId.description,
        amount: payment.amount,
        rollNo: payment.student.rollNumber,
        dateCreated: payment.datecreated,
        responsibleName: payment.responsibleId.responsiblename
      }));


      // Generate a receipt after saving
     // const receipt = this.generateReceipt(paymentInfo);

      // Return the saved payments and the receipt
      return { payments: savedPayments, receipts };
    } catch (error) {
      throw new InternalServerErrorException("Error creating payments: " + (error.message || error));
    }
  }

  private generateReceipt(payments: Payment[]): any {
    return {
      receiptId: `REC-${Date.now()}`,
      date: new Date(),
      totalAmount: payments.reduce((sum, payment) => sum + payment.amount, 0),
      paymentDetails: payments.map(payment => ({
     //   studentName: payment.studentClass.studentName, // Assuming `studentName` exists in `studentClass`
        rollNo: payment.rollNo,
        amount: payment.amount,
        monthName: payment.monthName,
      })),
    };
  }


  private async validateDuplicatePayments(studentClassId: number, monthName: string): Promise<void> {
    const existingPayment = await this.paymentRepository.findOne({
      where: { studentClass: { studentClassId }, monthName },
    });
    if (existingPayment) {
      throw new ConflictException("Duplicate payment for the same student and month.");
    }
  }



}
