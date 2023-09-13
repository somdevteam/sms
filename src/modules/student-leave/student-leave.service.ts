import {ConflictException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { CreateStudentLeaveDto } from './dto/create-student-leave.dto';
import { UpdateStudentLeaveDto } from './dto/update-student-leave.dto';
import {StudentLeave} from "./entities/student-leave.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {StudentService} from "../studentModule/student/student.service";
import {Student} from "../studentModule/student/entities/student.entity";
import {ApiBaseResponse} from "../../common/dto/apiresponses.dto";

@Injectable()
export class StudentLeaveService {
  constructor(
      @InjectRepository(StudentLeave)
      private readonly studentLeaveRepository: Repository<StudentLeave>,

      private readonly studentService: StudentService
  ) {}



  async create(payload: CreateStudentLeaveDto) {
    let studentid = await this.studentService.findOne(payload.studentid)
    if(!studentid){
        throw new ConflictException(`This student with a #${studentid} does not exist`)
      //new ApiBaseResponse('student leave already exists',6006,null);
    }
    try {

       let studentLeave = new StudentLeave();
      studentLeave.reason = payload.reason;
      studentLeave.dateCreated = new Date();
      studentLeave.studentClass = payload.studentclassid;
      studentLeave.student = studentLeave.student;
      await  this.studentLeaveRepository.save(studentLeave);
      return new ApiBaseResponse('saved success',6006, null);
    }
    catch (error) {
      if (error) {
        throw new ConflictException(error.message)
      }
      throw new InternalServerErrorException(
          "an error occurred while creating")
    }



  }

   findAll() {
    return  this.studentLeaveRepository.find();
  }

  async findOne(id: number) {

    let value = await  this.studentLeaveRepository.findOne({where:{studentLeaveID:id}});
    let testID = value.studentLeaveID;
    return value;
  }

   async update(id: number, payload) {
    // return `This action updates a #${id} studentLeave`;
      let studentLeaveToUpdate = await this.studentLeaveRepository.findOne({where:{studentLeaveID:id}});
      if(!studentLeaveToUpdate.studentLeaveID){
          throw new ConflictException( 'already exists');
      }
        try {
               studentLeaveToUpdate = new StudentLeave();
               studentLeaveToUpdate.studentLeaveID =id;
                studentLeaveToUpdate.reason =payload.reason;
              //  studentLeaveToUpdate.dateLeave = new Date();
                studentLeaveToUpdate.dateCreated = new Date()
          await  this.studentLeaveRepository.update(studentLeaveToUpdate.studentLeaveID,studentLeaveToUpdate);
            console.log(studentLeaveToUpdate);
                return new ApiBaseResponse('Updated success',6006,studentLeaveToUpdate);

        }
catch (error) {
    if (error) {
        throw new ConflictException(error.message)
    }
    throw new InternalServerErrorException(
        "an error occurred while creating")
}
  }

  async remove(id: number) {
      let studentleaveToDelete = this.studentLeaveRepository.findOne({where:{studentLeaveID:id}});
      if(!studentleaveToDelete){
          throw new ConflictException( 'already exists');
      }
      try {

          await this.studentLeaveRepository.delete(id)
          return new ApiBaseResponse('Deleted success',6006,studentleaveToDelete)

      }
      catch (error){
          if (error) {
              throw new ConflictException(error.message)
          }
          throw new InternalServerErrorException(
              "an error occurred while deleting")
      }
    // return `This action removes a #${id} studentLeave`;
  }
}
