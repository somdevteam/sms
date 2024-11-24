import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { ResponsibleService } from './responsible.service';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UpdateResponsibleDto } from './dto/update-responsible.dto';
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import { ApiBaseResponse } from "../../../common/dto/apiresponses.dto";

@Controller('responsible')
export class ResponsibleController {
  constructor(private readonly responsibleService: ResponsibleService) {}

  @Post('create')
  create(@Body() CreateResponsibleDto:CreateResponsibleDto ) {
    return this.responsibleService.create(CreateResponsibleDto);
  }

  @Get('getAllResponsible')
  findAll() {
    return this.responsibleService.findAll();
  }

  @Get('getResponsibleById/:id')
  findOne(@Param('id') id: string) {
    return this.responsibleService.findOne(+id);
  }

  @Get('getResponsibleByPhone/:phone')
  async findResponsibleByMobile(@Param('phone') phone: string) {
    console.log("responsiblephone "+phone);
    const  result =await this.responsibleService.findResponsibleByPhone(phone);
    return new ApiBaseResponse('Success',200,result)

  }

  //@UseGuards(JwtAuthGuard)
  @Post('update/:id')
  update( @Param('id') id: number, @Body() updateResponsibleDto) {
    console.log(updateResponsibleDto);
    return this.responsibleService.update(+id,updateResponsibleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsibleService.remove(+id);
  }
}
