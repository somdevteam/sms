import { Controller, Get, Post, Body, Patch, Param, Delete, Request, BadRequestException } from "@nestjs/common";
import { PaymentsService } from './payments.service';
import { CreateMultiplePaymentsDto, CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBaseResponse } from "../../common/dto/apiresponses.dto";
import { IsDateString, IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class PaymentFilterDto {
  @IsNotEmpty({ message: 'Start date is required' })
  @IsDateString()
  startDate: string;

  @IsNotEmpty({ message: 'End date is required' })
  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  status?: number;

  @IsOptional()
  @IsNumber()
  classId?: number;

  @IsOptional()
  @IsNumber()
  sectionId?: number;

  @IsOptional()
  @IsNumber()
  paymentStateId?: number;

  @IsOptional()
  @IsString()
  searchFilter?: string;
}

@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('add')
  async create(@Body() createPaymentDto: CreatePaymentDto):Promise<ApiBaseResponse> {
    await this.paymentsService.create(createPaymentDto);
    return new ApiBaseResponse('Payment created successfully',200,null);
  }

  @Post("add-multiple")
  async createMultiplePayments(@Body() createMultiplePaymentsDto: CreateMultiplePaymentsDto): Promise<ApiBaseResponse> {
    const result = await this.paymentsService.createMultiple(createMultiplePaymentsDto.payments);
    console.log(result);
    return new ApiBaseResponse("Payments created successfully", 200, result);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }

  @Get('findAllPaymentTypes')
  async findAllPaymentTypes():Promise<ApiBaseResponse>  {
    const data = await this.paymentsService.findAllPaymentTypes();
    return new ApiBaseResponse('Success',200,data);
  }

  @Get('findAllPaymentStates')
  async findAllPaymentStates():Promise<ApiBaseResponse>  {
    const data = await this.paymentsService.findAllPaymentStates();
    return new ApiBaseResponse('Success',200,data);
  }

  @Get('findAllFeeTypes')
  async findAllFeeTypes():Promise<ApiBaseResponse>  {
    const data = await this.paymentsService.findAllFeeTypes();
    return new ApiBaseResponse('Success',200,data);
  }

  @Get('findAllMonths')
  async findAllMonths():Promise<ApiBaseResponse>  {
    const data = await this.paymentsService.findAllMonths();
    return new ApiBaseResponse('Success',200,data);
  }
  @Post('getPaymentByFilter')
  async getPayments(@Body() filterDto: PaymentFilterDto): Promise<ApiBaseResponse> {
    // Validate date format for both start and end dates
    if (!this.isValidDate(filterDto.startDate) || !this.isValidDate(filterDto.endDate)) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }

    // Validate that end date is not before start date
    if (new Date(filterDto.endDate) < new Date(filterDto.startDate)) {
      throw new BadRequestException('End date cannot be before start date');
    }

    const payments = await this.paymentsService.getPayments(
      filterDto.startDate,
      filterDto.endDate,
      filterDto.type,
      filterDto.status,
      filterDto.classId,
      filterDto.sectionId,
      filterDto.paymentStateId,
      filterDto.searchFilter
    );

    return new ApiBaseResponse('success', 200, payments);
  }

  private isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    return regex.test(dateString) && !isNaN(new Date(dateString).getTime());
  }



}
