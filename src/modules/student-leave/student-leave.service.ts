import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException
} from '@nestjs/common';
import { CreateStudentLeaveDto } from './dto/create-student-leave.dto';
import { UpdateStudentLeaveDto } from './dto/update-student-leave.dto';
import {StudentLeave} from "./entities/student-leave.entity";
import {FindOneOptions, Repository} from "typeorm";
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
        throw new NotFoundException(`Student with ID ${payload.studentid} has already taken a leave`)
    }
      // Check if the student has already taken a leave
      const existingLeave = await this.studentLeaveRepository.findOne({
          where: {
              //student: studentid,
              student: studentid as any,
          },
      } as FindOneOptions<StudentLeave>);

      if (existingLeave) {
          throw new NotAcceptableException(`Student with ID ${payload.studentid} has already taken a leave.`);
      }
    try {

       let studentLeave = new StudentLeave();
      studentLeave.reason = payload.reason;
      studentLeave.dateCreated = new Date();
      studentLeave.studentClass = payload.studentclassid;
      studentLeave.student = payload.studentid;
      await  this.studentLeaveRepository.save(studentLeave);
      return studentLeave;
    }
    catch (error) {
      if (error) {
        throw new ConflictException(error.message)
      }
      throw new InternalServerErrorException(
          "an error occurred while creating student-leave ")
    }



  }

   findAll() {
    return  this.studentLeaveRepository.find();
  }

  async findOne(id: number) {

    let value = await  this.studentLeaveRepository.findOne({where:{studentLeaveID:id}});
    //let testID = value.studentLeaveID;
    return value;
  }

   async update(id: number, payload) {
      let studentLeaveToUpdate = await this.studentLeaveRepository.findOne({where:{studentLeaveID:id}});
      if(!studentLeaveToUpdate.studentLeaveID){
          throw new NotFoundException( 'This student-leave does not exist');}
        try {
               studentLeaveToUpdate = new StudentLeave();
               studentLeaveToUpdate.studentLeaveID =id;
                studentLeaveToUpdate.reason =payload.reason;
                studentLeaveToUpdate.dateCreated = new Date()
               studentLeaveToUpdate.student =payload.studentid;
          await this.studentLeaveRepository.update(studentLeaveToUpdate.studentLeaveID,studentLeaveToUpdate);
           // console.log(studentLeaveToUpdate);
                return studentLeaveToUpdate;
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
          throw new NotFoundException( 'this student-leave does not exist!');
      }
      try {

          await this.studentLeaveRepository.delete(id)
          return id;

      }
      catch (error){
          if (error) {
              throw new ConflictException(error.message)
          }
          throw new InternalServerErrorException(
              "an error occurred while deleting")
      }

  }
}
