import {ConflictException, Injectable, InternalServerErrorException, NotAcceptableException} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import {Repository} from "typeorm";
import {ApiBaseResponse} from "../../../common/dto/apiresponses.dto";

@Injectable()
export class StudentService {
constructor(
    @InjectRepository(Student) 
    private StudentRepository: Repository<Student>,
) {}

  
  async create(payload:CreateStudentDto) {
    let stduentid = await this.findOne(payload.studentid);
    if(stduentid){
      throw  new NotAcceptableException(
         new ApiBaseResponse("this student already exists",6006, stduentid),
          );
    }

    try{
      let stdent = new Student();
      stdent.firstname = payload.firstname;
      stdent.middlename = payload.middlename;
      stdent.lastname = payload.lastname;
      stdent.Sex =payload.sex;
      stdent.dob = new  Date();
      stdent.bob = payload.bob;
      //stdent.responsible = payload;
      const savedStudent = this.StudentRepository.save(stdent);
      return 'A new student has been registered!' +stdent;
    } catch (error){
     if(error){
       throw new ConflictException(error.message);
     }
     throw new InternalServerErrorException(
         new ApiBaseResponse("An error occurred while creating student",6006, null));
    }

  }

  findAll() {

    return this.StudentRepository.find();
  }

  findOne(id: number): Promise <Student> {
  return  this.StudentRepository.findOne({where:{studentid: id}})
    //return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
