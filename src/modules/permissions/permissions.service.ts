import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permissions.entity';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionsRepository: Repository<Permission>,
    ) {}

    async findAll(): Promise<Permission[]> {
        return this.permissionsRepository.find();
    }
}
