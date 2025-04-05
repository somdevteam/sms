export class PaymentChargeResponseDto {
  chargeRequestId: number;
  chargeType: {
    chargeTypeId: number;
    name: string;
    description: string;
  };
  studentFullName: string;
  dueDate: Date;
  dateCreated: Date;
  academicYear: string;
  status: string;
  levelFee: number;
  className: string;
  sectionName: string;
  studentId: number;
  rollNumber: number;
} 