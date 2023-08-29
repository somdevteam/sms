import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import {Repository} from "typeorm";
import {ApiBaseResponse} from "../../../common/dto/apiresponses.dto";
import {ResponsibleService} from "../../academicModule/responsible/responsible.service";

@Injectable()
export class StudentService {
constructor(
    @InjectRepository(Student) private StudentRepository: Repository<Student>,
    private responsibleService: ResponsibleService
) {}

  
  async create(payload:CreateStudentDto) :Promise<any>{
    let stduentid = await this.findOne(payload.studentid);
    if(stduentid){
      throw  new NotAcceptableException(
         new ApiBaseResponse("this student already exists",6006, stduentid),
          );
    }

    try{

        const responsible = await this.responsibleService.findOne(payload.responsibleId);
        console.log((await responsible).responsibleid)
      let stdent = new Student();
      stdent.firstname = payload.firstname;
      stdent.middlename = payload.middlename;
      stdent.lastname = payload.lastname;
      stdent.Sex =payload.sex;
      stdent.dob = new  Date();
      stdent.bob = payload.bob;
      stdent.responsible = responsible;
      const savedStudent = this.StudentRepository.save(stdent);
      return new ApiBaseResponse('A new student has been registered!',6006,stdent);
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

 async update(id: number, paylaod: UpdateStudentDto) {
    let studentToUpdate = await this.StudentRepository.findOne({
      where: { studentid: paylaod.studentid,}});

   if(!studentToUpdate){
  throw new NotFoundException(new ApiBaseResponse("student not found",6006,null))
  }
     try {
         studentToUpdate.firstname = paylaod.firstname;
         studentToUpdate.middlename =paylaod.middlename;
         studentToUpdate.lastname =paylaod.lastname;
         studentToUpdate.Sex =paylaod.sex;
         studentToUpdate.dob = new Date();
         studentToUpdate.bob = paylaod.bob;

         await this.StudentRepository.update(studentToUpdate.studentid,studentToUpdate);
         return new ApiBaseResponse('Updated success',6006,studentToUpdate);

     }
     catch (error){
         if(error){
             throw new ConflictException(error.message)
         }
         throw new  InternalServerErrorException(
             new ApiBaseResponse("an error occurred while updating",6006,null))
     }

    // return `This action updates a #${id} student`;
  }

  async remove(id: number) {
      let studentToRemove = await this.StudentRepository.findOne({where:{studentid:id}});
      if(!studentToRemove){
          throw  new NotFoundException(new ApiBaseResponse('Responsible not found',6006,null))
      }
      await  this.StudentRepository.delete(id);
      return new ApiBaseResponse('Deleted success',6006,`Student with id: ${id} deleted`);
    //return `This action removes a #${id} student`;
  }
}
