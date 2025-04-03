import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentChargeRequest } from './entities/payment-charge-request.entity';
import { CreatePaymentChargeRequestDto, UpdatePaymentChargeRequestDto, PaymentChargeRequestFilterDto, GenerateChargesDto } from './dto/payment-charge-request.dto';
import { StudentClassService } from '../studentModule/studentclass/studentclass.service';
import { StudentService } from '../studentModule/student/student.service';
import { StudentsByClassSectionDto } from "../studentModule/student/dto/class-section.dto";
import { ChargeStatus } from './enums/charge-status.enum';

@Injectable()
export class PaymentChargeRequestService {
  constructor(
    @InjectRepository(PaymentChargeRequest)
    private chargeRequestRepository: Repository<PaymentChargeRequest>,
    private readonly studentClassService: StudentClassService,
    private readonly studentService: StudentService,
  ) {}

  async create(createDto: CreatePaymentChargeRequestDto): Promise<PaymentChargeRequest> {
    const student = await this.studentService.findOne(createDto.studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const studentClass = await this.studentClassService.findOne(createDto.studentClassId);
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

  async findAll(filterDto?: PaymentChargeRequestFilterDto): Promise<PaymentChargeRequest[]> {
    const queryBuilder = this.chargeRequestRepository.createQueryBuilder('charge')
      .leftJoinAndSelect('charge.student', 'student')
      .leftJoinAndSelect('charge.studentClass', 'studentClass')
      .leftJoinAndSelect('studentClass.classSection', 'classSection')
      .leftJoinAndSelect('classSection.class', 'class')
      .leftJoinAndSelect('classSection.section', 'section');

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

    return await queryBuilder.getMany();
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
    // Get active students for the branch
    const activeStudents = await this.studentService.findActiveStudentsByBranch(generateDto.branchId);
    
    if (!activeStudents || activeStudents.length === 0) {
      throw new NotFoundException('No active students found in the specified branch');
    }

    const charges: PaymentChargeRequest[] = [];

    // Create charge requests for each student
    for (const student of activeStudents) {
      const chargeData = {
        studentId: student.studentid,
        studentClassId: student.studentclassid,
        branchId: student.branchid,
        academicId: student.academicId,
        academicYear: student.academicYear,
        levelId: student.levelid,
        levelFee: student.levelfee,
        dueDate: new Date(), // You might want to set this based on your business logic
        chargeTypeId: generateDto.chargeTypeId,
        status: ChargeStatus.PENDING,
        description: `Payment charge for ${student.academicYear}`,
        createdBy: generateDto.createdBy,
        loginHistoryId: generateDto.loginHistoryId
      };

      // If it's a monthly charge and monthId is provided, add month-specific logic
      if (generateDto.monthId) {
        // Add any month-specific logic here
        chargeData.description = `Monthly payment charge for ${student.academicYear} - Month ${generateDto.monthId}`;
      }

      const charge = this.chargeRequestRepository.create(chargeData);
      charges.push(charge);
    }

    // Save all charge requests
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

  async generateChargesForActiveStudents(branchId: number, academicId: number): Promise<PaymentChargeRequest[]> {
    // Get active students for the branch
    const activeStudents = await this.studentService.findActiveStudentsByBranch(branchId);
    
    // Create charge requests for each student
    const chargeRequests = activeStudents.map(student => {
      const charge = this.chargeRequestRepository.create({
        studentId: student.studentid,
        studentClassId: student.studentclassid,
        branchId: student.branchid,
        academicId: academicId,
        academicYear: student.academicYear,
        levelId: student.levelid,
        levelFee: student.levelfee,
        dueDate: new Date(), // You might want to set this based on your business logic
        chargeTypeId: 1, // Default charge type ID, adjust as needed
        status: ChargeStatus.PENDING,
        description: `Payment charge for ${student.academicYear}`
      });
      return charge;
    });

    // Save all charge requests
    return await this.chargeRequestRepository.save(chargeRequests);
  }
} 
