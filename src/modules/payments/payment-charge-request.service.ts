import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentChargeRequest } from './entities/payment-charge-request.entity';
import { CreatePaymentChargeRequestDto, UpdatePaymentChargeRequestDto, PaymentChargeRequestFilterDto, GenerateChargesDto } from './dto/payment-charge-request.dto';
import { StudentClassService } from '../studentModule/studentclass/studentclass.service';
import { StudentService } from '../studentModule/student/student.service';
import { StudentsByClassSectionDto } from "../studentModule/student/dto/class-section.dto";
import { ChargeStatus } from './enums/charge-status.enum';
import { ChargeType } from './entities/charge-type.entity';
import { PaymentChargeResponseDto } from './dto/payment-charge-response.dto';
import { createFullName } from "../../common/enum/sms.enum";
import { Months } from "../../common/months.entity";

@Injectable()
export class PaymentChargeRequestService {
  constructor(
    @InjectRepository(PaymentChargeRequest)
    private chargeRequestRepository: Repository<PaymentChargeRequest>,
    @InjectRepository(ChargeType)
    private chargeTypeRepository: Repository<ChargeType>,
    private readonly studentClassService: StudentClassService,
    private readonly studentService: StudentService,
    @InjectRepository(Months)
    private monthsRepository: Repository<Months>,
  ) {}

  async create(createDto: PaymentChargeRequestFilterDto): Promise<PaymentChargeRequest> {
    const student = await this.studentService.findOne(1);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const studentClass = await this.studentClassService.findOne(1);
    if (!studentClass) {
      throw new NotFoundException('Student class not found');
    }

    const charge = this.chargeRequestRepository.create({
      ...createDto,
      student,
      studentClass,
      status: ChargeStatus.PENDING
    });

    return await this.chargeRequestRepository.save(charge);
  }

  async findAll(filterDto?: PaymentChargeRequestFilterDto): Promise<PaymentChargeResponseDto[]> {
    const queryBuilder = this.chargeRequestRepository.createQueryBuilder('charge')
      .leftJoinAndSelect('charge.student', 'student')
      .leftJoinAndSelect('charge.studentClass', 'studentClass')
      .leftJoinAndSelect('studentClass.classSection', 'classSection')
      .leftJoinAndSelect('classSection.class', 'class')
      .leftJoinAndSelect('classSection.section', 'section')
      .leftJoinAndSelect('charge.chargeType', 'chargeType');

    if (filterDto) {
      if (filterDto.classId) {
        queryBuilder.andWhere('class.classId = :classId', { classId: filterDto.classId });
      }

      if (filterDto.sectionId) {
        queryBuilder.andWhere('section.sectionId = :sectionId', { sectionId: filterDto.sectionId });
      }

      if (filterDto.status) {
        queryBuilder.andWhere('charge.status = :status', { status: filterDto.status });
      }

      if (filterDto.chargeTypeId) {
        queryBuilder.andWhere('charge.chargeTypeId = :chargeTypeId', { chargeTypeId: filterDto.chargeTypeId });
      }

      if (filterDto.startDate) {
        queryBuilder.andWhere('charge.dueDate >= :startDate', { startDate: filterDto.startDate });
      }

      if (filterDto.endDate) {
        queryBuilder.andWhere('charge.dueDate <= :endDate', { endDate: filterDto.endDate });
      }
    }

    const results = await queryBuilder.getMany();

    return results.map(charge => ({
      chargeRequestId: charge.chargeRequestId,
      chargeType: {
        chargeTypeId: charge.chargeType.chargeTypeId,
        name: charge.chargeType.name,
        description: charge.chargeType.description
      },
      studentFullName: createFullName(charge.student.firstname,charge.student.middlename,charge.student.lastname),
      dueDate: charge.dueDate,
      dateCreated: charge.createdAt,
      academicYear: charge.academicYear,
      status: charge.status,
      levelFee: charge.levelFee,
      className: charge.studentClass.classSection.class.classname,
      sectionName: charge.studentClass.classSection.section.sectionname,
      studentId: charge.studentId,
      rollNumber: charge.student.rollNumber
    }));
  }

  async findOne(chargeRequestId: number): Promise<PaymentChargeRequest> {
    const charge = await this.chargeRequestRepository.findOne({
      where: { chargeRequestId },
      relations: ['student', 'studentClass']
    });

    if (!charge) {
      throw new NotFoundException('Payment charge not found');
    }

    return charge;
  }

  async update(id: number, updateDto: UpdatePaymentChargeRequestDto): Promise<PaymentChargeRequest> {
    const charge = await this.findOne(id);
    
    Object.assign(charge, updateDto);
    return await this.chargeRequestRepository.save(charge);
  }

  async remove(id: number): Promise<void> {
    const result = await this.chargeRequestRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Payment charge not found');
    }
  }

  async markAsPaid(id: number): Promise<PaymentChargeRequest> {
    const charge = await this.findOne(id);
    charge.status = ChargeStatus.PAID;
    return await this.chargeRequestRepository.save(charge);
  }


  async generateCharges(generateDto: GenerateChargesDto): Promise<PaymentChargeRequest[]> {
    const activeStudents = await this.studentService.findActiveStudentsByBranch(generateDto.branchId);

    if (!activeStudents || activeStudents.length === 0) {
      throw new NotFoundException('No active students found in the specified branch');
    }

    const charges: PaymentChargeRequest[] = [];

    const quarterMonthsMap = {
      Q1: [1, 2, 3],
      Q2: [4, 5, 6],
      Q3: [7, 8, 9],
      Q4: [10, 11, 12]
    };

    let monthsToCharge: number[] = [];

    if (generateDto.chargeTypeCode === 'monthly') {
      if (!generateDto.monthId) {
        throw new BadRequestException('Month ID is required for monthly charges.');
      }
      monthsToCharge = [generateDto.monthId];
    } else if (quarterMonthsMap[generateDto.chargeTypeCode]) {
      monthsToCharge = quarterMonthsMap[generateDto.chargeTypeCode];
    } else {
      throw new BadRequestException('Invalid charge type code.');
    }

    const allMonths = await this.monthsRepository.find(); // [{ id: 1, name: 'January' }, ...]

    for (const student of activeStudents) {
      for (const month of monthsToCharge) {
        const monthName = allMonths.find(m => m.monthid === month)?.monthname || `Month ${month}`;

        const dueDate = new Date();
        dueDate.setMonth(month - 1);

        const chargeData = {
          studentId: student.studentid,
          studentClassId: student.studentclassid,
          branchId: student.branchid,
          academicId: student.academicId,
          academicYear: student.academicYear,
          levelId: student.levelid,
          levelFee: student.levelfee,
          dueDate,
          chargeTypeCode: generateDto.chargeTypeCode,
          status: ChargeStatus.PENDING,
          description: `Charge for ${monthName} - ${student.academicYear}`,
          createdBy: generateDto.createdBy,
          loginHistoryId: generateDto.loginHistoryId,
          month: monthName
        };

        const charge = this.chargeRequestRepository.create(chargeData);
        charges.push(charge);
      }
    }

    return await this.chargeRequestRepository.save(charges);
  }


  async checkOverdueCharges(): Promise<void> {
    const today = new Date();
    const overdueCharges = await this.chargeRequestRepository
      .createQueryBuilder('charge')
      .where('charge.dueDate < :today', { today })
      .andWhere('charge.status = :status', { status: ChargeStatus.PENDING })
      .getMany();

    for (const charge of overdueCharges) {
      charge.status = ChargeStatus.OVERDUE;
    }

    await this.chargeRequestRepository.save(overdueCharges);
  }

  // async generateChargesForActiveStudents(branchId: number, academicId: number): Promise<PaymentChargeRequest[]> {
  //   // Get active students for the branch
  //   const activeStudents = await this.studentService.findActiveStudentsByBranch(branchId);
  //
  //   // Create charge requests for each student
  //   const chargeRequests = activeStudents.map(student => {
  //     const charge = this.chargeRequestRepository.create({
  //       studentId: student.studentid,
  //       studentClassId: student.studentclassid,
  //       branchId: student.branchid,
  //       academicId: academicId,
  //       academicYear: student.academicYear,
  //       levelId: student.levelid,
  //       levelFee: student.levelfee,
  //       dueDate: new Date(), // You might want to set this based on your business logic
  //       chargeTypeId: 1, // Default charge type ID, adjust as needed
  //       status: ChargeStatus.PENDING,
  //       description: `Payment charge for ${student.academicYear}`
  //     });
  //     return charge;
  //   });
  //
  //   // Save all charge requests
  //   return await this.chargeRequestRepository.save(chargeRequests);
  // }

  async findAllChargeTypes(): Promise<ChargeType[]> {
    return await this.chargeTypeRepository.find({
      where: { isActive: true }
    });
  }

  async findChargeTypeById(id: number): Promise<ChargeType> {
    const chargeType = await this.chargeTypeRepository.findOne({
      where: { chargeTypeId: id, isActive: true }
    });
    
    if (!chargeType) {
      throw new NotFoundException('Charge type not found');
    }
    
    return chargeType;
  }
} 
