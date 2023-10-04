import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TabPermissions } from './entities/tabPermissions.entity';

@Injectable()
export class TabPermissionsService {
    constructor(
        @InjectRepository(TabPermissions)
        private readonly tabPermissionsRepository: Repository<TabPermissions>,
    ) {}

    async findAll(): Promise<TabPermissions[]> {
        return this.tabPermissionsRepository.find();
    }
}
