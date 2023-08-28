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

@Injectable()
export class ResponsibleService {
  constructor(
      @InjectRepository(Responsible)
      private ResponsibleRepository: Repository<Responsible>
  ) {}



  async create(payload:CreateResponsibleDto) {
    let responsibleid = await this.findOne(payload.responsibleid)
    if(responsibleid){
      throw new NotAcceptableException(
          new ApiBaseResponse("this responsible is already exists",6006,responsibleid));
    }

    try {
     let resp = new  Responsible();
     resp.responsiblename =payload.responsiblename;
     resp.phone =payload.phone;
       const  savedResponsible =  this.ResponsibleRepository.save(resp);
      return 'new Responsible has been created!' +savedResponsible;
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

  findOne(id: number): Promise <Responsible> {

    return this.ResponsibleRepository.findOne({where:{responsibleid: id}})
    //return `This action returns a #${id} responsible`;
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


  remove(id: number) {
    return `This action removes a #${id} responsible`;
  }
}
