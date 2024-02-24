import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicService } from '../academic/academic.service';
import { BranchService } from '../../branch/branch.service';
import { ClassService } from '../class/class.service';
import { SectionService } from '../section/section.service';
import { CreateClassSectionDto } from './dto/create-class-section.dto';
import { UpdateClassSectionDto } from './dto/update-class-section.dto';
import { ClassSection } from './entities/class-section.entity';
import { SectionByClassDto } from './dto/SectionByClas.dto';
import { BranchAcademicService } from 'src/modules/branch-academic/branch-academic.service';

@Injectable()
export class ClassSectionService {
  constructor(
    @InjectRepository(ClassSection)
    private classSectionRepository: Repository<ClassSection>,
    private readonly classService: ClassService,
    private readonly sectionService: SectionService,
    private readonly branchAcademicService: BranchAcademicService,
  ) {}

  getById(id: number): Promise<ClassSection> {
    return this.classSectionRepository.findOne({
      where: { classSectionId: id },
    });
  }
  async create(payload: CreateClassSectionDto) {
    const clas = await this.classService.getById(payload.classid);
    if (!clas) {
      throw new NotFoundException(`class with ID ${payload.classid} not found`);
    }

    const section = await this.sectionService.getById(payload.sectionid);
    if (!section) {
      throw new NotFoundException(
        `class section with ID ${payload.sectionid} not found`,
      );
    }

    const branchAcademic =
      await this.branchAcademicService.findAcademicBranchIdByBranchAndAcademic(
        payload.branchid,
        payload.academicid,
      );

    try {
      let classSection = new ClassSection();
      classSection.class = clas;
      classSection.section = section;
      classSection.branchAcademic = branchAcademic;
      classSection.dateCreated = new Date();

      return await this.classSectionRepository.save(classSection);
    } catch (error) {
      if (error) {
        throw new ConflictException(
          'The provided branch name is already associated.' + error.messages,
        );
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the branch.',
      );
    }
  }

  findAll() {
    return `This action returns all classSection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classSection`;
  }

  async update(payload: UpdateClassSectionDto) {
    const clas = await this.classService.getById(payload.classid);
    if (!clas) {
      throw new NotFoundException(`class with ID ${payload.classid} not found`);
    }

    const section = await this.sectionService.getById(payload.sectionid);
    if (!section) {
      throw new NotFoundException(
        `class section with ID ${payload.sectionid} not found`,
      );
    }

    const branchAcademic =
      await this.branchAcademicService.findAcademicBranchIdByBranchAndAcademic(
        payload.branchid,
        payload.academicid,
      );

    const foundClassSection = await this.getById(payload.classSectionId);
    //  foundClassSection.branch = branch;
    foundClassSection.class = clas;
    foundClassSection.section = section;
    foundClassSection.branchAcademic = branchAcademic;

    return await this.classSectionRepository.update(
      foundClassSection.classSectionId,
      foundClassSection,
    );
  }

  async remove(id: number) {
    const foundClassSection = await this.getById(id);

    if (!foundClassSection) {
      throw new NotFoundException('Branch Not found');
    }
    return this.classSectionRepository.delete(id);
  }

  async fetchSectionByClassId(payload: SectionByClassDto): Promise<any> {
    const classId = payload.classid;
    const branchId = payload.branchid;
    const academicId = payload.academicid;
    const data = await this.classSectionRepository
      .createQueryBuilder('classSection')
      .leftJoinAndSelect('classSection.branch', 'branch')
      .leftJoinAndSelect('classSection.class', 'class')
      .leftJoinAndSelect('classSection.section', 'section')
      .leftJoinAndSelect('classSection.academic', 'academic')
      .where('branch.branchid = :branchId', { branchId })
      .andWhere('class.classid = :classId', { classId })
      .andWhere('class.isactive = :isActive', { isActive: true })
      .select([
        'section.sectionid',
        'section.sectionname',
        'section.datecreated',
        'section.isactive',
      ]);
    if (academicId) {
      data.andWhere('academic.academicid = :academicId', { academicId });
    }

    return data.getRawMany();
  }

  async getSectionIdByClassIdAndSectionId(
    classId: number,
    sectionId: number,
    branchAcademicId: number
  ): Promise<ClassSection> {
    const classSection = await this.classSectionRepository
      .createQueryBuilder()
      .where('(classid = :classId AND sectionid=:sectionId and branchAcademicId=:branchAcademicId)', {
        classId: classId,
        sectionId: sectionId,
        branchAcademicId: branchAcademicId
      })
      .getOne();

    if (!classSection) {
      throw new NotFoundException('Class With this section not found');
    }
    return classSection;
  }



}
