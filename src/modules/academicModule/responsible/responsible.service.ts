import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException
} from '@nestjs/common';
import {CreateResponsibleDto} from './dto/create-responsible.dto';
import {UpdateResponsibleDto} from './dto/update-responsible.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Responsible} from "./entities/responsible.entity";
import {Repository} from "typeorm";
import {ApiBaseResponse} from "../../../common/dto/apiresponses.dto";
import {AcademicEntity} from "../academic/entities/academic.entity";

@Injectable()
export class ResponsibleService {
    constructor(
        @InjectRepository(Responsible)
        private ResponsibleRepository: Repository<Responsible>
    ) {
    }

    async getByPhone(resPhone: string): Promise<Responsible> {
        return await this.ResponsibleRepository.findOne({where: {phone: resPhone}});
    }


    async create(payload: CreateResponsibleDto) {
        let responsiblePhone = await this.getByPhone(payload.phone)
        if (responsiblePhone) {
            throw new NotAcceptableException(
                `this responsible with this phone ${payload.phone}  is already exists`);
        }

        try {
            let resp = new Responsible();
            resp.responsiblename = payload.responsiblename;
            resp.phone = payload.phone;
            const savedResponsible = this.ResponsibleRepository.save(resp);
            return 'new Responsible has been created!';
        } catch (error) {
            if (error) {
                throw  new ConflictException(error.message)
            }
            throw new InternalServerErrorException(
                "An error occurred while creating student"
            );
        }

    }

    findAll() {
        return this.ResponsibleRepository.find();
    }

    async findOne(id: number): Promise<Responsible> {
        return await this.ResponsibleRepository.findOne({where: {responsibleid: id}})
    }

    async update(id: number, payload: UpdateResponsibleDto) {

        let responsibleToUpdate = await this.ResponsibleRepository.findOne({
            where: {responsibleid: id,}
        });

        if (!responsibleToUpdate) {
            throw new NotFoundException("responsible not found")
        }

        try {
            responsibleToUpdate.responsiblename = payload.responsiblename;
            responsibleToUpdate.phone = payload.phone;
            await this.ResponsibleRepository.update(responsibleToUpdate.responsibleid, responsibleToUpdate);
            return 'Updated success';

        } catch (error) {
            if (error) {
                throw new ConflictException(error.message)
            }
            throw new InternalServerErrorException(
                "an error occurred while updating")
        }
    }


    async remove(id: number) {
        let responsibleToRemove = await this.ResponsibleRepository.findOne({where: {responsibleid: id}});
        if (!responsibleToRemove) {
            throw  new NotFoundException('Responsible not found');
        }
        await this.ResponsibleRepository.delete(id);
        return 'Deleted success';
    }
}
