import { ConflictException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { Section } from './entities/section.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
  ) {}

  getBySectionname(sectionname: string): Promise<Section> {
    return this.sectionRepository.findOne({ where: { sectionname } });
  }

  getById(id: number): Promise<Section> {
    return this.sectionRepository.findOne({ where: { sectionid: id } });
  }

  async create(payload: CreateSectionDto) :Promise<Section> {
    let sectionname = await this.getBySectionname(payload.sectionname);
    if (sectionname) {
      throw new NotAcceptableException(
        'The level name currently exists. Please choose another one.',
      );
    }

    let section = new Section();
    section.sectionname = payload.sectionname;
    section.datecreated = new Date();
    try {
      const savedClass = this.sectionRepository.save(section);
      return savedClass;
    } catch (error) {
      if (error) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the user.',
      );
    }
  }

  findAll() {
    return this.sectionRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} level`;
  }

  async update(payload: UpdateSectionDto) {
    let foundSection = await this.getById(payload.sectionid);

    if (!foundSection) {
      throw new NotFoundException('level not found');
    }

    try {
      foundSection.sectionname = payload.sectionname;
      return await this.sectionRepository.update(foundSection.sectionid, foundSection);
    } catch (error) {
      if (error) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the user.',
      );
    }
  }

  async remove(id: number) {
    let foundsection = await this.getById(id);

    if (!foundsection) {
      throw new NotFoundException('level not found');
    }
    return await this.sectionRepository.delete(id);
  }


  async findSections1(payload: any) {
    return await this.sectionRepository
  .createQueryBuilder('sec')
  .leftJoinAndSelect('sec.classSection', 'cs','cs.classId = :classId', {classId: payload.classId})
  .leftJoin('cs.branchAcademic','ba','ba.academic')
  .getMany();

  }

  async findSectionByFilter(payload: any): Promise<any[]> {
    const sections = await this.sectionRepository.find({
      relations: ['classSection'],
      where: {
        classSection: {
          class : {classid : payload.classId},
          branchAcademic: {
            branch: {branchId : payload.branchId,isActive: true},
          },
        }
      }
    })

    if (!payload.isMissing) return sections;

    const existingSectionNumbers = sections.map(section => section.sectionid);
    const allSections = await this.sectionRepository.find();

    // Find missing sections
    const missingSections = allSections.filter(section => !existingSectionNumbers.includes(section.sectionid));
    return missingSections;
  }

  
}
