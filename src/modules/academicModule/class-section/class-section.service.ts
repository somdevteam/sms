import { ConflictException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
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
  ) { }

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
    const classId = payload.classId;
    const branchId = payload.branchId;
    const academicId = payload.academicId;
    const data = this.classSectionRepository
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
    academicBranchId: number
  ): Promise<ClassSection> {
    const classSection = await this.classSectionRepository.findOne({
      where : {
        class: {classid: classId},
        section: {sectionid:  sectionId},
        branchAcademic: {academicBranchId : academicBranchId}}
      }
    );

    if (!classSection) {
      throw new NotFoundException('Class With this section not found');
    }
    return classSection;
  }

  async assignSectionToClass(payload: SectionByClassDto) {
    const { branchId, classId, sections } = payload;

    // Find the active branch academic
    const academicBranch = await this.branchAcademicService.findActiveBranchAcademic(branchId);

    // Check if any of the section-class combinations already exist
    const existingClassSections = await Promise.all(sections.map(async (data) => {
        const existingSectionClass = await this.classSectionRepository.findOne({
            where: {
                class: { classid: classId },
                section: { sectionid: data.sectionid },
                branchAcademic: academicBranch,
            },
        });

        if (existingSectionClass) {
            throw new NotAcceptableException(`Section with ID ${data.sectionid} is already assigned to class with ID ${classId} in branch ${branchId}.`);
        }

        const sectionClass = this.classSectionRepository.create({
            class: { classid: classId },
            section: { sectionid: data.sectionid },
            branchAcademic: academicBranch,
            dateCreated: new Date(),
        });

        return sectionClass;
    }));

    // Save the new section-class combinations
    return await this.classSectionRepository.save(existingClassSections);
}

  async getSectionByClassAndBranch(payload: SectionByClassDto): Promise<any> {
    const { branchId, classId } = payload;
    const academicBranch = await this.branchAcademicService.findActiveBranchAcademic(branchId);
    const classSection = await this.classSectionRepository.find({
      where: {
        class: { classid: classId },
        branchAcademic: academicBranch,
      },
      relations: ['section'],
    });
    return classSection.map((item) => item.section);
  }
}
