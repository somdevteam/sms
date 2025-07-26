import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentChargeRequest } from './entities/payment-charge-request.entity';
import {
  CreatePaymentChargeRequestDto,
  UpdatePaymentChargeRequestDto,
  PaymentChargeRequestFilterDto,
  GenerateChargesDto,
} from './dto/payment-charge-request.dto';
import { StudentClassService } from '../studentModule/studentclass/studentclass.service';
import { StudentService } from '../studentModule/student/student.service';
import { ChargeStatus } from './enums/charge-status.enum';
import { ChargeType } from './entities/charge-type.entity';
import { PaymentChargeResponseDto } from './dto/payment-charge-response.dto';
import { createFullName, feeTypes } from "../../common/enum/sms.enum";
import { Months } from '../../common/months.entity';
import { Feetypes } from "./entities/feetypes.entity";
import { Branch } from "../branch/branch.entity";

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
    @InjectRepository(Feetypes)
    private feeTypeRepository: Repository<Feetypes>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,

  ) {}

  async create(
    createDto: CreatePaymentChargeRequestDto,
  ): Promise<PaymentChargeRequest> {
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
      status: ChargeStatus.PENDING,
    });

    return await this.chargeRequestRepository.save(charge);
  }

  async findAll(
    filterDto?: PaymentChargeRequestFilterDto,
  ): Promise<{ data: PaymentChargeResponseDto[]; total: number }> {
    const queryBuilder = this.chargeRequestRepository
      .createQueryBuilder('charge')
      .leftJoinAndSelect('charge.student', 'student')
      .leftJoinAndSelect('charge.studentClass', 'studentClass')
      .leftJoinAndSelect('studentClass.classSection', 'classSection')
      .leftJoinAndSelect('classSection.class', 'class')
      .leftJoinAndSelect('classSection.section', 'section')
      .leftJoinAndSelect('charge.chargeType', 'chargeType')
      .leftJoinAndSelect('charge.branch', 'branch')
      .leftJoinAndSelect('charge.feeType', 'Feetypes');

    if (filterDto) {
      // Always apply class and section filters if provided
      if (filterDto.classId) {
        queryBuilder.andWhere('class.classId = :classId', {
          classId: filterDto.classId,
        });
      }

      if (filterDto.sectionId) {
        queryBuilder.andWhere('section.sectionId = :sectionId', {
          sectionId: filterDto.sectionId,
        });
      }

      // Apply date range filters if provided
      if (filterDto.startDate && filterDto.endDate) {
        queryBuilder.andWhere(
          'charge.dueDate BETWEEN :startDate AND :endDate',
          {
            startDate: filterDto.startDate,
            endDate: filterDto.endDate,
          },
        );
      } else {
        // Only apply status filter if date range is not provided
        if (filterDto.status) {
          queryBuilder.andWhere('charge.status = :status', {
            status: filterDto.status,
          });
        }
      }

      if (filterDto.chargeTypeId) {
        queryBuilder.andWhere('charge.chargeTypeId = :chargeTypeId', {
          chargeTypeId: filterDto.chargeTypeId,
        });
      }
    }

    // Add pagination
    const page = filterDto?.page || 1;
    const limit = filterDto?.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit).orderBy('charge.dueDate', 'DESC');

    const [results, total] = await queryBuilder.getManyAndCount();

    return {
      data: results.map((charge) => ({
        chargeRequestId: charge.chargeRequestId,
        chargeType: charge.chargeType.name,
        chargedMonth: charge.chargedMonth,
        studentFullName: createFullName(
          charge.student.firstname,
          charge.student.middlename,
          charge.student.lastname,
        ),
        dueDate: charge.dueDate,
        dateCreated: charge.createdAt,
        academicYear: charge.academicYear,
        status: charge.status,
        levelFee: charge.levelFee,
        className: charge.studentClass.classSection.class.classname,
        sectionName: charge.studentClass.classSection.section.sectionname,
        studentId: charge.studentId,
        rollNumber: charge.student.rollNumber,
        amount:charge.amount,
        branchId:charge.branch.branchId,
        feeTypeId:charge.feeType.feetypeid
      })),
      total,
    };
  }

  async findOne(chargeRequestId: number): Promise<PaymentChargeRequest> {
    const charge = await this.chargeRequestRepository.findOne({
      where: { chargeRequestId },
      relations: ['student', 'studentClass'],
    });

    if (!charge) {
      throw new NotFoundException('Payment charge not found');
    }

    return charge;
  }

  async update(
    id: number,
    updateDto: UpdatePaymentChargeRequestDto,
  ): Promise<PaymentChargeRequest> {
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

  async generateCharges(
    generateDto: GenerateChargesDto,
  ): Promise<PaymentChargeRequest[]> {
    const activeStudents = await this.studentService.findActiveStudentsByBranch(
      generateDto.branchId,
    );

    if (!activeStudents || activeStudents.length === 0) {
      throw new NotFoundException(
        'No active students found in the specified branch',
      );
    }

    const charges: PaymentChargeRequest[] = [];

    const quarterMonthsMap = {
      Q1: [1, 2, 3],
      Q2: [4, 5, 6],
      Q3: [7, 8, 9],
      Q4: [10, 11, 12],
    };

    let monthsToCharge: number[] = [];

    if (generateDto.chargeTypeCode === 'monthly') {
      if (!generateDto.monthId) {
        throw new BadRequestException(
          'Month ID is required for monthly charges.',
        );
      }
      monthsToCharge = [generateDto.monthId];
    } else if (quarterMonthsMap[generateDto.chargeTypeCode]) {
      monthsToCharge = quarterMonthsMap[generateDto.chargeTypeCode];
    } else {
      throw new BadRequestException('Invalid charge type code.');
    }

    const allMonths = await this.monthsRepository.find();
    const chargeType = await this.chargeTypeRepository.findOne({
      where: { chargeTypeCode: generateDto.chargeTypeCode },
    });

    const feetypeData = await this.feeTypeRepository.findOne({
      where: { feetypeid: generateDto.feeTypeId },
    });

    // fee type data
    if (!feetypeData) {
      throw new NotFoundException('Fee  type not found');
    }

    // Get branch data
    const branch = await this.branchRepository.findOne({
      where: { branchId: generateDto.branchId },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }


    for (const student of activeStudents) {
      for (const month of monthsToCharge) {
        const monthName =
          allMonths.find((m) => m.monthid === month)?.monthname ||
          `Month ${month}`;

        // Extract years from academic year (e.g., "2025-2026" -> [2025, 2026])
        const academicYears = student.academicYear
          .split('-')
          .map((year) => parseInt(year.trim()));
        const currentYear = new Date().getFullYear();

        // Check if charge already exists for this student, month and charge type
        const existingCharge = await this.chargeRequestRepository.findOne({
          where: {
            studentId: student.studentid,
            chargedMonth: monthName,
            academicYear: student.academicYear,
            branch:branch,
            feeType:feetypeData,
          },
          order: {
            createdAt: 'DESC', // Get the most recent charge if multiple exist
          },
        });

        if (existingCharge) {
          // Check if the existing charge was created in the current academic year
          const chargeYear = new Date(existingCharge.createdAt).getFullYear();

          // If the charge was created in either year of the academic year, skip creating a new one
          if (academicYears.includes(chargeYear)) {
            continue; // Skip creating duplicate charge
          }
        }

        const dueDate = new Date();
        dueDate.setMonth(month - 1);

        let amount = feetypeData.amount;
        if(feetypeData.feetypeid == feeTypes.CLASSFEE){
          amount = student.levelfee;
        }

        const chargeData = {
          studentId: student.studentid,
          studentClassId: student.studentclassid,
          branch:branch,
          feeType:feetypeData,
          academicId: student.academicId,
          academicYear: student.academicYear,
          levelId: student.levelid,
          levelFee: student.levelfee,
          amount:amount,
          chargedMonth: monthName,
          dueDate,
          chargeType: chargeType,
          chargeTypeByCode: chargeType.chargeTypeCode,
          status: ChargeStatus.PENDING,
          description: `Charge for ${monthName} - ${student.academicYear}`,
          createdBy: generateDto.createdBy,
          loginHistoryId: generateDto.loginHistoryId,
          month: monthName,
        };

        const charge = this.chargeRequestRepository.create(chargeData);
        charges.push(charge);
      }
    }

    if (charges.length === 0) {
      throw new BadRequestException(
        'No new charges to create - all charges already exist for the current academic year',
      );
    }

    try {
      return await this.chargeRequestRepository.save(charges);
    } catch (e) {
      throw new InternalServerErrorException(
        'Failed to save generated charges',
        e.message,
      );
    }
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

  async findAllChargeTypes(): Promise<ChargeType[]> {
    return await this.chargeTypeRepository.find({
      where: { isActive: true },
    });
  }

  async findChargeTypeById(id: number): Promise<ChargeType> {
    const chargeType = await this.chargeTypeRepository.findOne({
      where: { chargeTypeId: id, isActive: true },
    });

    if (!chargeType) {
      throw new NotFoundException('Charge type not found');
    }

    return chargeType;
  }
}
