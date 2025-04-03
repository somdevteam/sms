import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { PaymentChargeRequestService } from './payment-charge-request.service';
import { CreatePaymentChargeRequestDto, UpdatePaymentChargeRequestDto, PaymentChargeRequestFilterDto, GenerateChargesDto } from './dto/payment-charge-request.dto';
import { ApiBaseResponse } from '../../common/dto/apiresponses.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GeneratePaymentChargesDto } from './dto/generate-payment-charges.dto';

@Controller('payment-charge-request')
//@UseGuards(JwtAuthGuard)
export class PaymentChargeRequestController {
  constructor(private readonly chargeRequestService: PaymentChargeRequestService) {}

  @Post()
  async create(@Body() createDto: CreatePaymentChargeRequestDto): Promise<ApiBaseResponse> {
    const chargeRequest = await this.chargeRequestService.create(createDto);
    return new ApiBaseResponse('Payment charge request created successfully', 200, chargeRequest);
  }

  @Get()
  async findAll(@Query() filterDto: PaymentChargeRequestFilterDto): Promise<ApiBaseResponse> {
    const chargeRequests = await this.chargeRequestService.findAll(filterDto);
    return new ApiBaseResponse('Payment charge requests retrieved successfully', 200, chargeRequests);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiBaseResponse> {
    const chargeRequest = await this.chargeRequestService.findOne(+id);
    return new ApiBaseResponse('Payment charge request retrieved successfully', 200, chargeRequest);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePaymentChargeRequestDto,
  ): Promise<ApiBaseResponse> {
    const chargeRequest = await this.chargeRequestService.update(+id, updateDto);
    return new ApiBaseResponse('Payment charge request updated successfully', 200, chargeRequest);
  }

  @Post(':id/mark-paid')
  async markAsPaid(@Param('id') id: string): Promise<ApiBaseResponse> {
    const chargeRequest = await this.chargeRequestService.markAsPaid(+id);
    return new ApiBaseResponse('Payment charge request marked as paid successfully', 200, chargeRequest);
  }

  @Post('generate-charges')
  async generateCharges(@Body() generateChargesDto: GenerateChargesDto): Promise<ApiBaseResponse> {
    const charges = await this.chargeRequestService.generateCharges(
      generateChargesDto
    );
    return new ApiBaseResponse('Payment charges generated successfully', 200, charges);
  }
} 
