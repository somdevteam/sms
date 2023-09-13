import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tab } from './entities/tabs.entity';

@Injectable()
export class TabService {
    constructor(
        @InjectRepository(Tab)
        private readonly tabRepository: Repository<Tab>,
    ) {}

    async findAll(): Promise<Tab[]> {
        return this.tabRepository.find();
    }
}
