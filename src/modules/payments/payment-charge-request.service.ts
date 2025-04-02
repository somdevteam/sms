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

      if (filterDto.dueCategory) {
        queryBuilder.andWhere('charge.dueCategory = :dueCategory', { dueCategory: filterDto.dueCategory });
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
    const studentsByClassSection: StudentsByClassSectionDto = {
      classId: generateDto.classId,
      sectionId: generateDto.sectionId,
      academicId: 1, // Default value, adjust as needed
      branchId: 1    // Default value, adjust as needed
    };

    const students = await this.studentService.getStudentsByClassIdAndSectionId(studentsByClassSection, null);
    if (!students || students.length === 0) {
      throw new NotFoundException('No students found in the specified class and section');
    }

    const charges: PaymentChargeRequest[] = [];
    for (const student of students) {
      const charge = this.chargeRequestRepository.create({
        student,
        studentClass: student.studentClass[0],
        amount: generateDto.amount,
        dueDate: new Date(generateDto.dueDate),
        dueCategory: generateDto.dueCategory,
        status: ChargeStatus.PENDING
      });
      charges.push(charge);
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
} 
