import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { StudentExamMarks } from './entities/student-exam-marks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamsInfo } from '../exams/entities/exam-info.entity';
import { Subject } from 'src/modules/academicModule/subject/entities/subject.entity';
import { Student } from 'src/modules/studentModule/student/entities/student.entity';
import { ExamResultDto } from './dto/exam-result.dto';
import { AcademicBranch } from 'src/modules/branch-academic/entities/branch-academic.entity';
import { StudentClass } from 'src/modules/studentModule/student/entities/student-class.entity';


@Injectable()
export class StudentExamMarksService {
  constructor(
    @InjectRepository(StudentExamMarks)
    private studentExamMarksRepository: Repository<StudentExamMarks>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(StudentClass)
    private studentClassRepository: Repository<StudentClass>,
    @InjectRepository(ExamsInfo)
    private examsInfoRepository: Repository<ExamsInfo>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(AcademicBranch)
    private academicBranchRepository: Repository<AcademicBranch>,
  ) { }

  async fetchStudentExamMarks1(payload: ExamResultDto): Promise<any> {
    const { branchId, examId, classId, sectionId } = payload;

    const academicBranch = await this.academicBranchRepository.findOne({
      where: {
        branch: { branchId: branchId },
        isActive: true,
      },
      relations: ['branch', 'academic'],
    });

    if (!academicBranch) {
      throw new BadRequestException('Academic branch not found');
    }

    const subjects = await this.subjectRepository.find({
      relations: ['classSubject'],
      where: {
        classSubject: {
          class: { classid: classId },
          branch: { branchId: branchId }
        }
      }
    });
    const subjectConditions = subjects.map(subject =>
      `SUM(CASE WHEN subject.subject_name = '${subject.subject_name}' THEN studentExamMarks.mark ELSE null END) AS "${subject.subject_name}"`
    ).join(', ');

    const query = this.studentRepository.createQueryBuilder('std')
      .leftJoinAndSelect('std.studentClass', 'stdClass')
      .leftJoinAndSelect('stdClass.classSection', 'classSection')
      .leftJoinAndSelect('classSection.branchAcademic', 'branchAcademic')
      .leftJoinAndSelect('stdClass.studentExamMarks', 'studentExamMarks')

      .leftJoinAndSelect('studentExamMarks.examInfo', 'examInfo', 'examInfo.academicBranch.branch.branchId = :branchId', { branchId })
      .leftJoinAndSelect('examInfo.exam', 'exam', 'exam.examid = :examId', { examId })
      .leftJoinAndSelect('studentExamMarks.subject', 'subject')
      .select([
        'std.studentid AS studentId',
        'std.firstname AS firstName',
        'std.middlename AS middleName',
        'std.lastname AS lastName',
        subjectConditions,
        'SUM(studentExamMarks.mark) AS total',
      ])
      .andWhere('classSection.classid = :classId', { classId })
      .andWhere('branchAcademic.branchid = :branchId', { branchId: academicBranch.branch.branchId })
    if (sectionId) {
      query.andWhere('classSection.sectionid = :sectionId', { sectionId })
    }
    query.groupBy('std.studentid')
    const results = await query.getRawMany();
    return {
      subjects,
      results
    };
  }

  async fetchStudentExamMarks(payload: ExamResultDto): Promise<{ subjects: Subject[]; results: any[] }> {
    const { branchId, examId, classId, sectionId } = payload;

    // Fetch academic branch
    const academicBranch = await this.academicBranchRepository.findOne({
      where: {
        branch: { branchId },
        isActive: true,
      },
      relations: ['branch', 'academic'],
    });

    if (!academicBranch) {
      throw new BadRequestException('Academic branch not found');
    }

    // Fetch subjects for the given branch and class
    const subjects = await this.subjectRepository.find({
      relations: ['classSubject'],
      where: {
        classSubject: {
          class: { classid: classId },
          branch: { branchId },
        },
      },
    });

    // Build subject conditions for the query
    const subjectConditions = subjects
      .map(
        (subject) =>
          `SUM(CASE WHEN subject.subject_name = '${subject.subject_name}' THEN studentExamMarks.mark ELSE null END) AS "${subject.subject_name}"`,
      )
      .join(', ');

    // Build and execute the query
    const query = this.studentRepository
      .createQueryBuilder('std')
      .innerJoinAndSelect('std.studentClass', 'stdClass')
      .innerJoinAndSelect('stdClass.classSection', 'classSection')
      .innerJoinAndSelect('classSection.class', 'class')
      .innerJoinAndSelect('classSection.section', 'section')
      .innerJoinAndSelect('classSection.branchAcademic', 'branchAcademic')
      .leftJoinAndSelect('stdClass.studentExamMarks', 'studentExamMarks')
      .leftJoinAndSelect(
        'studentExamMarks.examInfo', 'examInfo'
      )
      .leftJoinAndSelect('examInfo.exam', 'exam', 'exam.examid = :examId', { examId })
      .leftJoinAndSelect('studentExamMarks.subject', 'subject')
      .select([
        'stdClass.studentClassId AS studentClassId',
        'std.firstName',
        'std.middleName',
        'std.lastName',
        'GROUP_CONCAT(studentExamMarks.id) AS studentExamMarksIds',
        'GROUP_CONCAT(studentExamMarks.subject_id) AS studentExamMarksSubjectIds',
         subjectConditions,
        'SUM(studentExamMarks.mark) AS total',
      ])
      .andWhere('class.classId = :classId', { classId })
      .andWhere('branchAcademic.branchid = :branchId', { branchId: academicBranch.branch.branchId });

    if (sectionId) {
      query.andWhere('section.sectionId = :sectionId', { sectionId });
    }

    query.groupBy('stdClass.studentClassId');
    const results = await query.getRawMany();

    return {
      subjects,
      results,
    };
  }

  async addStudentExamMarks(payload: any): Promise<any> {
    const { studentClassId, examId, subjectId, marks } = payload;

    // const studentClass = await this.studentClassRepository.findOne({
    //   where: {
    //     studentClassId,
    //   },
    // });

    const findStudentExamMark = await this.studentExamMarksRepository.findOne({
      relations: ['studentClass', 'examInfo', 'subject'],
      where: {
        studentClass: {
          studentClassId,
        },
        examInfo: {
          exam: { examId },
        },
        subject: {
          subject_id: subjectId,
        },
      },
    });

    if (findStudentExamMark) {
      return this.updateStudentExamMarks(payload,findStudentExamMark.id);
    }

    const examInfo = await this.examsInfoRepository.findOne({
      where: {
        exam: { examId },
      },
    });

    if (!examInfo) {
      throw new BadRequestException('Exam info not found');
    }

    const studentExamMarks = this.studentExamMarksRepository.create({
      studentClass: {studentClassId},
      examInfo,
      subject: { subject_id: subjectId },
      mark: marks,
    });

    await this.studentExamMarksRepository.save(studentExamMarks);

    return studentExamMarks;
  }

  async updateStudentExamMarks(payload: any, id: number): Promise<any> {
    const { marks,subjectId } = payload;

    const studentExamMarks = await this.studentExamMarksRepository.findOne({
      where: {id},
      relations: ['subject']
    });

    if (!studentExamMarks) {
      return  this.addStudentExamMarks(payload);
    }

    studentExamMarks.mark = marks;
    studentExamMarks.subject.subject_id = subjectId
    await this.studentExamMarksRepository.save(studentExamMarks);

    return studentExamMarks;
  }

}
