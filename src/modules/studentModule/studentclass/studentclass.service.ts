// studentcCass.service.ts
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentClass } from './entities/studentclass.entity';
import { StudentclassArrayDto, StudentclassDto } from './dto/studentclass.dto';
import { StudentService } from '../student/student.service';
import { ClassSectionService } from '../../academicModule/class-section/class-section.service';
import { AcademicService } from 'src/modules/academicModule/academic/academic.service';
import { BranchService } from 'src/modules/branch/branch.service';
import { CurrentUser } from 'src/common/dto/currentuser.dto';
import { ClassSection } from 'src/modules/academicModule/class-section/entities/class-section.entity';
import { ClassService } from 'src/modules/academicModule/class/class.service';
import { SectionService } from 'src/modules/academicModule/section/section.service';
@Injectable()
export class StudentClassService {
  constructor(
    @InjectRepository(StudentClass)
    private readonly studentClassRepository: Repository<StudentClass>,
    @Inject(forwardRef(() => StudentService))
    private readonly studentService: StudentService,
    private readonly classSectionService: ClassSectionService,
    private readonly academicYearService: AcademicService,
    private readonly branchService: BranchService,
    private readonly classService:ClassService,
    private readonly sectionService:SectionService,
  ) {}

  async create(studentClassData: StudentclassDto): Promise<StudentClass> {
    const studentClass = new StudentClass();
    //   studentClass.student = studentClassData.studentId;
    // studentClass.classSection = studentClassData.classSectionId;
    studentClass.dateCreated = new Date();
    // await this.studentClassRepository.create(studentClass);
    return await this.studentClassRepository.save(studentClass);
  }

  async findAll(): Promise<StudentClass[]> {
    return await this.studentClassRepository.find();
  }

  async findOne(studentClassId: number): Promise<StudentClass> {
    return await this.studentClassRepository.findOne(null);
  }

  async update(
    studentClassId: number,
    studentClassData: Partial<StudentClass>,
  ): Promise<StudentClass> {
    await this.studentClassRepository.update(studentClassId, studentClassData);
    return await this.studentClassRepository.findOne(null);
  }

  async remove(studentClassId: number): Promise<void> {
    await this.studentClassRepository.delete(studentClassId);
  }

  async promoteStudents(
    payload: StudentclassArrayDto,
    currentUser:CurrentUser
  ): Promise<StudentClass[]> {

    const studentClasses: StudentClass[] = [];

    if (!payload.students || payload.students.length === 0) {
      throw new NotAcceptableException(
        'The studentClassDataArray is null or empty.',
      );
    }

    if (currentUser.profile.branchId == null && payload.branchId == null) {
      throw new NotFoundException('branch is required');
    }

    const branchId = payload.branchId != null ? payload.branchId : currentUser.profile.branchId;

    const existingBranch = await this.branchService.getById(+branchId);
    if (!existingBranch) {
      throw new NotFoundException('this branch not found');
    }

    const existingAcademicYear = await this.academicYearService.getById(payload.academicYearId);
    if (!existingAcademicYear) {
      throw new NotFoundException('this academic year not found');
    }
    

    if (payload.fromClass >= payload.toClass) {
      throw new NotAcceptableException('promote in class must be higher than from class');
    }

    const existingClass = await this.classService.getById(payload.toClass);

    if (!existingClass) {
      throw new NotFoundException('to class not foud');
    }

    const existingSection = await this.sectionService.getById(payload.toSection);

    if (!existingSection) {
      throw new NotFoundException('to section not foud');
    }



    let savedClassSection = null;
    const existingClassSection =
    await this.classSectionService.getSectionIdByClassIdAndSectionId(
      payload.toClass,
      payload.toSection,
    );

  if (!existingClassSection) {
    const newClassSection = new ClassSection();
    // newClassSection.academic = existingAcademicYear;
    // newClassSection.branch = existingBranch;
    newClassSection.class = existingClass;
    newClassSection.section = existingSection;
    newClassSection.dateCreated = new Date();
    savedClassSection = await this.studentClassRepository.save(newClassSection);
  }
    

    try {
      for (const studentClassData of payload.students) {
        const existingStudent = await this.studentService.findOne(
          studentClassData.studentId,
        );
        if (!existingStudent) {
          throw new NotFoundException('Student not found');
        }

        const studentClass = new StudentClass();
        studentClass.student = existingStudent;
        studentClass.classSection = existingClassSection ? existingClassSection : savedClassSection;
        studentClass.dateCreated = new Date();

        await this.studentClassRepository.create(studentClass);
        studentClasses.push(
          await this.studentClassRepository.save(studentClass),
        );
      }
    } catch (error) {
      // Handle errors
      throw new InternalServerErrorException(
        'Failed to promote students: ' + error.message,
      );
    }

    return studentClasses;
  }
}
