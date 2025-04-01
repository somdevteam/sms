import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  BadRequestException
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
import { Student as StudentEntity } from "../studentModule/student/entities/student.entity";
import { StudentClass } from "../studentModule/studentclass/entities/studentclass.entity";

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
    @InjectRepository(StudentEntity) private studentRepository: Repository<StudentEntity>,
    @InjectRepository(StudentClass) private studentClassRepository: Repository<StudentClass>
  ) {
  }

  async getStudentByRollNumber(rollNumber: string): Promise<StudentEntity> {
    const student = await this.studentRepository.createQueryBuilder('student')
      .leftJoinAndSelect('student.studentClass', 'studentClass')
      .leftJoinAndSelect('studentClass.classSection', 'classSection')
      .leftJoinAndSelect('classSection.class', 'class')
      .leftJoinAndSelect('classSection.section', 'section')
      .leftJoinAndSelect('student.responsible', 'responsible')
      .where('student.rollNumber = :rollNumber', { rollNumber })
      .getOne();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async getResponsibleByMobile(mobile: string): Promise<Responsible> {
    const responsible = await this.responsibleRepository.createQueryBuilder('responsible')
      .leftJoinAndSelect('responsible.student', 'student')
      .leftJoinAndSelect('student.studentClass', 'studentClass')
      .leftJoinAndSelect('studentClass.classSection', 'classSection')
      .leftJoinAndSelect('classSection.class', 'class')
      .leftJoinAndSelect('classSection.section', 'section')
      .where('responsible.phone = :mobile', { mobile })
      .getOne();

    if (!responsible) {
      throw new NotFoundException('Responsible not found');
    }

    return responsible;
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Start a transaction
    const queryRunner = this.paymentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate student exists and is active
      const student = await this.studentRepository.findOne({
        where: { 
          studentid: createPaymentDto.studentId,
          isActive: true 
        },
        relations: ['studentClass']
      });

      if (!student) {
        throw new NotFoundException('Student not found or inactive');
      }

      const studentClass = await this.studentClassRepository.findOne({
        where: {
          studentClassId: createPaymentDto.studentClassId
        }
      });
      // Validate student class
      if (!studentClass) {
        throw new BadRequestException('Student is not assigned to any class');
      }

      // Get month data
      const month = await this.monthsRepository.findOne({
        where: { monthid: createPaymentDto.monthId }
      });

      if (!month) {
        throw new NotFoundException('Month not found');
      }

      // Validate payment type
      const paymentType = await this.paymentTypesRepository.findOne({
        where: { paymenttypeid: createPaymentDto.paymentTypeId }
      });

      if (!paymentType) {
        throw new NotFoundException('Payment type not found');
      }

      // Validate payment state
      const paymentState = await this.paymentStateRepository.findOne({
        where: { paymentstateid: createPaymentDto.paymentStateId }
      });

      if (!paymentState) {
        throw new NotFoundException('Payment state not found');
      }

      // Validate responsible
      const responsible = await this.responsibleRepository.findOne({
        where: { responsibleid: createPaymentDto.responsibleId }
      });

      if (!responsible) {
        throw new NotFoundException('Responsible person not found');
      }

      // Validate amount
      if (createPaymentDto.amount <= 0) {
        throw new BadRequestException('Payment amount must be greater than 0');
      }

      // Check for duplicate payment
      const existingPayment = await this.paymentRepository.findOne({
        where: {
          student: { studentid: student.studentid },
          month: { monthid: createPaymentDto.monthId }
        }
      });

      if (existingPayment) {
        throw new ConflictException('Payment already exists for this month');
      }

      // Create new payment
      const payment = this.paymentRepository.create({
        student,
        studentClass:studentClass,
        amount: createPaymentDto.amount,
        month,
        monthName: month.monthname,
        paymentType,
        paymentState,
        responsible,
        rollNo: createPaymentDto.rollNo,
        details: createPaymentDto.details,
        datecreated: new Date()
      });

      const savedPayment = await queryRunner.manager.save(payment);

      // Return payment with related data for receipt
      const result = await queryRunner.manager.findOne(Payment, {
        where: { studentfeeid: savedPayment.studentfeeid },
        relations: [
          'student',
          'student.responsible',
          'paymentType',
          'paymentState',
          'month'
        ]
      });

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException || 
          error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error creating payment: ${error.message}`
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getPayments(
    startDate: string,
    endDate: string,
    type?: string,
    status?: number,
    classId?: number,
    sectionId?: number,
    paymentStateId?: number,
    searchFilter?: string
  ): Promise<Payment[]> {
    try {
      const queryBuilder = this.paymentRepository.createQueryBuilder('payment')
        .leftJoinAndSelect('payment.studentClass', 'studentClass')
        .leftJoinAndSelect('studentClass.student', 'student')
        .leftJoinAndSelect('studentClass.classSection', 'classSection')
        .leftJoinAndSelect('classSection.class', 'class')
        .leftJoinAndSelect('classSection.section', 'section')
        .leftJoinAndSelect('student.responsible', 'responsible')
        .leftJoinAndSelect('payment.paymentType', 'paymentType')
        .leftJoinAndSelect('payment.paymentState', 'paymentState');

      // Always apply date filter
      queryBuilder.andWhere('DATE(payment.datecreated) BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      });

      // Apply search filter based on type
      if (searchFilter && searchFilter.trim() !== '') {
        switch (type) {
          case 'rollNumber':
            queryBuilder.andWhere('payment.rollNo = :searchFilter', { 
              searchFilter: searchFilter.trim() 
            });
            break;
          case 'mobileNumber':
            queryBuilder.andWhere('responsible.phone = :searchFilter', { 
              searchFilter: searchFilter.trim() 
            });
            break;
        }
      }

      // Apply class filter
      if (classId) {
        queryBuilder.andWhere('class.classId = :classId', { classId });
      }
      
      // Apply section filter
      if (sectionId) {
        queryBuilder.andWhere('section.sectionId = :sectionId', { sectionId });
      }

      // Apply payment status filter
      if (status) {
        queryBuilder.andWhere('paymentState.paymentstateid = :status', { status });
      }

      const payments = await queryBuilder.getMany();

      if (!payments || payments.length === 0) {
        throw new NotFoundException('No payments found matching the criteria');
      }

      return payments;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error fetching payments: ${error.message}`);
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
    const queryRunner = this.paymentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const paymentEntities = [];

      for (const paymentDto of paymentDtos) {
        // Validate all references
        const [feeType, feeState, studentClass, monthData, responsible] = await Promise.all([
          this.paymentTypesRepository.findOne({ where: { paymenttypeid: paymentDto.paymentTypeId } }),
          this.paymentStateRepository.findOne({ where: { paymentstateid: paymentDto.paymentStateId } }),
          this.studentClassService.findOne(paymentDto.studentClassId),
          this.monthsRepository.findOne({ where: { monthid: paymentDto.monthId } }),
          this.responsibleRepository.findOne({ where: { responsibleid: paymentDto.responsibleId } })
        ]);

        if (!feeType || !feeState || !studentClass || !monthData || !responsible) {
          throw new NotFoundException('One or more required references not found');
        }

        // Validate amount
        if (paymentDto.amount <= 0) {
          throw new BadRequestException('Payment amount must be greater than 0');
        }

        // Check for duplicate payment
        await this.validateDuplicatePayments(studentClass.studentClassId, monthData.monthname);

        // Get student
        const student = await this.studentService.findOne(paymentDto.studentId);
        if (!student || !student.isActive) {
          throw new NotFoundException('Student not found or inactive');
        }

        // Create payment entity
        const payment = new Payment();
        payment.student = student;
        payment.studentClass = studentClass;
        payment.month = monthData;
        payment.monthName = monthData.monthname;
        payment.paymentType = feeType;
        payment.paymentState = feeState;
        payment.amount = paymentDto.amount;
        payment.datecreated = new Date();
        payment.responsible = responsible;
        payment.rollNo = paymentDto.rollNo;

        paymentEntities.push(payment);
      }

      // Save all payments in a single transaction
      const savedPayments = await queryRunner.manager.save(paymentEntities);

      // Generate receipts
      const receipts = savedPayments.map(payment => ({
        fullname: createFullName(
          payment.student.firstname,
          payment.student.middlename,
          payment.student.lastname
        ),
        monthName: payment.monthName,
        paymentState: payment.paymentState.description,
        amount: payment.amount,
        rollNo: payment.student.rollNumber,
        dateCreated: payment.datecreated,
        responsibleName: payment.responsible.responsiblename,
        totalAmount: savedPayments.reduce((sum, p) => sum + Number(p.amount), 0)
      }));

      await queryRunner.commitTransaction();
      return { payments: savedPayments, receipts };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException || 
          error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error creating payments: ${error.message}`
      );
    } finally {
      await queryRunner.release();
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

  async generateReceipts(paymentIds: number): Promise<any[]> {
    try {
      const payment = await this.paymentRepository.createQueryBuilder('payment')
        .leftJoinAndSelect('payment.student', 'student')
        .leftJoinAndSelect('payment.studentClass', 'studentClass')
        .leftJoinAndSelect('studentClass.classSection', 'classSection')
        .leftJoinAndSelect('classSection.class', 'class')
        .leftJoinAndSelect('classSection.section', 'section')
        .leftJoinAndSelect('payment.paymentState', 'paymentState')
        .leftJoinAndSelect('payment.responsible', 'responsible')
        .leftJoinAndSelect('payment.paymentType', 'paymentType')
        .where('payment.studentfeeid = :paymentIds', { paymentIds })
        .getOne();

      if (!payment) {
        throw new NotFoundException('Payment not found with the provided ID');
      }

      const schoolInfo = {
        name: 'Ramadan High School',
        address: '123 JaaleSiyaad Street, Mogadishu',
        contact: '+1 (555) 123-4567',
        email: 'info@ramdanhighschool.com',
      };

      return [{
        header: {
          schoolName: schoolInfo.name,
          schoolAddress: schoolInfo.address,
          schoolContact: schoolInfo.contact,
          schoolEmail: schoolInfo.email,
        },
        paymentDetails: {
          receiptId: `REC-${payment.studentfeeid}-${Date.now()}`,
          paymentId: payment.studentfeeid,
          fullname: createFullName(
            payment.student.firstname,
            payment.student.middlename,
            payment.student.lastname
          ),
          monthName: payment.monthName,
          paymentState: payment.paymentState.description,
          amount: payment.amount,
          rollNo: payment.rollNo,
          dateCreated: payment.datecreated,
          responsibleName: payment.responsible.responsiblename,
          totalAmount: payment.amount,
          className: payment.studentClass.classSection.class.classname,
          sectionName: payment.studentClass.classSection.section.sectionname,
          paymentType: payment.paymentType.type
        }
      }];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error generating receipt: ' + (error.message || error)
      );
    }
  }
}
