import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException
} from '@nestjs/common';
import {CreateStudentDto} from './dto/create-student.dto';
import {UpdateStudentDto} from './dto/update-student.dto';
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
    ) {
    }


    async create(payload: CreateStudentDto): Promise<any> {
        // let isStudentExist = await this.findOne(payload.studentid);
        // if(isStudentExist){
        //   throw  new NotAcceptableException(
        //      "this student already exists"
        //       );
        // }
        const responsible = await this.responsibleService.findOne(payload.responsibleId);
        if(!responsible){
             throw new NotFoundException("The responsible you selected does not exist")
        }

        try {
            let student = new Student();
            student.firstname = payload.firstname;
            student.middlename = payload.middlename;
            student.lastname = payload.lastname;
            student.Sex = payload.sex;
            student.dob = new Date();
            student.bob = payload.bob;
            student.responsible = responsible;
            return await this.StudentRepository.save(student);
        } catch (error) {
            if (error) {
                throw new ConflictException(error.message);
            }
            throw new InternalServerErrorException(
                "An error occurred while creating student");
        }

    }

    findAll() {
        return this.StudentRepository.find();
    }

    findOne(id: number): Promise<Student> {
        return this.StudentRepository.findOne({where: {studentid: id}})
    }

    async update(id: number, payload: UpdateStudentDto) {
        let studentToUpdate = await this.StudentRepository.findOne({
            where: {studentid: id,}
        });

        if (!studentToUpdate) {
            throw new NotFoundException("student not found")
        }
        const responsible = await this.responsibleService.findOne(payload.responsibleId);
        if (!responsible) {
             throw new NotFoundException("The responsible you selected does not exist")
        }
        try {
            studentToUpdate.firstname = payload.firstname;
            studentToUpdate.middlename = payload.middlename;
            studentToUpdate.lastname = payload.lastname;
            studentToUpdate.Sex = payload.sex;
            studentToUpdate.dob = new Date();
            studentToUpdate.bob = payload.bob;
            studentToUpdate.responsible = responsible;

            await this.StudentRepository.update(studentToUpdate.studentid, studentToUpdate);
            return 'Updated success';

        } catch (error) {
            if (error) {
                throw new ConflictException(error.message)
            }
            throw new InternalServerErrorException(
                "an error occurred while updating")
        }

        // return `This action updates a #${id} student`;
    }

    async remove(id: number) {
        let studentToRemove = await this.StudentRepository.findOne({where: {studentid: id}});
        if (!studentToRemove) {
            throw  new NotFoundException(new ApiBaseResponse('Responsible not found', 6006, null))
        }
        await this.StudentRepository.delete(id);
        return `Deleted success`;
    }
}
