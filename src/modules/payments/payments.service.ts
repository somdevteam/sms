import { ConflictException, Injectable, InternalServerErrorException, NotAcceptableException } from "@nestjs/common";
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

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(Paymenttypes) private paymentTypesRepository: Repository<Paymenttypes>,
    @InjectRepository(Paymenttypes) private paymentStateRepository: Repository<PaymentStates>,
    private readonly studentClassService: StudentClassService,
  ) {
  }

  async create(payload: CreatePaymentDto) {

    const feeTypeId = await this.paymentTypesRepository.findOne({ where: { paymenttypeid: payload.studentFeeTypeId } });
    const studentClassId = await this.studentClassService.findOne(payload.studentClassId);

    if (feeTypeId.amount != payload.amount){
      throw new ConflictException('Misconfigured Amounts');
    }

    try {
      let payment = new Payment();
      payment.studentClass = studentClassId;
      payment.monthName = payload.monthName;
      payment.studentFeeType = feeTypeId;
      payment.amount = payload.amount;
      payment.datecreated = new Date();
      return await this.paymentRepository.save(payment);
    } catch (error) {
      if (error) {
        throw new ConflictException(
          "The provided branch name is already associated." + error.messages
        );
      }
      throw new InternalServerErrorException(
        "An error occurred while creating the branch."
      );
    }
  }

  findAll() {
    return `This action returns all payments`;
  }

  async findAllPaymentTypes() {
    return await this.paymentTypesRepository.find();
  }

  async findAllPaymentStates() {
    return await this.paymentTypesRepository.find();
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



}
