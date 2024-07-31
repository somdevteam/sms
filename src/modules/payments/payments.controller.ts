import { Controller, Get, Post, Body, Patch, Param, Delete, Request, BadRequestException } from "@nestjs/common";
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBaseResponse } from "../../common/dto/apiresponses.dto";

@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('add')
  async create(@Body() createPaymentDto: CreatePaymentDto):Promise<ApiBaseResponse> {
    await this.paymentsService.create(createPaymentDto);
    return new ApiBaseResponse('Payment created successfully',200,null);
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
  @Get('findAllMonths')
  async findAllMonths():Promise<ApiBaseResponse>  {
    const data = await this.paymentsService.findAllMonths();
    return new ApiBaseResponse('Success',200,data);
  }
  @Post('getPaymentByFilter')
  async getPayments(@Request() req): Promise<ApiBaseResponse> {
    // Validate date format
    const Date =req.body.date ;
    const rollNo = req.body.rollNumber
    if (Date && !this.isValidDate(Date)) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }
    const payment = await  this.paymentsService.getPayments(Date, rollNo);
    return new ApiBaseResponse('success',200,payment);
  }

  private isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    return regex.test(dateString) && !isNaN(new Date(dateString).getTime());
  }



}
