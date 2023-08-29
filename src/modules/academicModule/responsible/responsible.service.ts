import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException
} from '@nestjs/common';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UpdateResponsibleDto } from './dto/update-responsible.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Responsible} from "./entities/responsible.entity";
import {Repository} from "typeorm";
import {ApiBaseResponse} from "../../../common/dto/apiresponses.dto";
import {AcademicEntity} from "../academic/entities/academic.entity";

@Injectable()
export class ResponsibleService {
  constructor(
      @InjectRepository(Responsible)
      private ResponsibleRepository: Repository<Responsible>
  ) {}

  async getByPhone(resphone: string): Promise<Responsible> {
    return await this.ResponsibleRepository.findOne({where: {phone:resphone}});
  }



  async create(payload:CreateResponsibleDto) {
    let responsiblePhone = await this.getByPhone(payload.phone)
    if(responsiblePhone){
      throw new NotAcceptableException(
          new ApiBaseResponse(`this responsible with this phone ${payload.phone}  is already exists`,6006,responsiblePhone));
    }

    try {
     let resp = new  Responsible();
     resp.responsiblename =payload.responsiblename;
     resp.phone =payload.phone;
       const  savedResponsible =  this.ResponsibleRepository.save(resp);
      return new ApiBaseResponse('new Responsible has been created!',6006,resp);
    } catch (error){
      if(error){
        throw  new ConflictException(error.message)
      }
      throw new InternalServerErrorException(
          new ApiBaseResponse("An error occurred while creating student",6006,null)
      );
    }

  }

  findAll() {
    return this.ResponsibleRepository.find();
  }

  async findOne(id: number): Promise <Responsible> {

    return await this.ResponsibleRepository.findOne({where:{responsibleid: id}})

  }

  async update( id: number, payload:UpdateResponsibleDto) {

    let responsibleToUpdate = await this.ResponsibleRepository.findOne({
      where: { responsibleid: payload.responsibleid,}});

    // let  foundResponsible = await this.findOne(payload.responsibleid)
    if(!responsibleToUpdate){
      throw new NotFoundException(new ApiBaseResponse("responsible not found",6006,null))
    }



    try {
      responsibleToUpdate.responsiblename = payload.responsiblename;
       await this.ResponsibleRepository.update(responsibleToUpdate.responsibleid,responsibleToUpdate);
      return 'Updated success';

    }
    catch (error){
      if(error){
        throw new ConflictException(error.message)
      }
      throw new  InternalServerErrorException(
          new ApiBaseResponse("an error occurred while updating",6006,null))
    }
  }



 async remove(id: number) {
   let responsibleToRemove = await this.ResponsibleRepository.findOne({where:{responsibleid:id}});
   if(!responsibleToRemove){
     throw  new NotFoundException(new ApiBaseResponse('Responsible not found',6006,null))
   }
   await  this.ResponsibleRepository.delete(id);
    return new ApiBaseResponse('Deleted success',6006,`Responsible with id: ${id} deleted`);
  }
}
