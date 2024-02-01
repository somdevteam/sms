import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {FindManyOptions, Repository} from 'typeorm';
import { UserRolesEntity } from './entities/userroles.entity';
import {UserEntity} from "../user/user.entity";

@Injectable()
export class UserRolesService {
    constructor(
      @InjectRepository(UserRolesEntity)
      private readonly userRolesRepository: Repository<UserRolesEntity>,
    ) {}

    async findAllUserRoles(): Promise<UserRolesEntity[]> {
        return await this.userRolesRepository.find();
    }

    // async findUserRolesByUserId(user: number): Promise<UserRolesEntity[]> {
    //     return await this.userRolesRepository.find( {where: {user:user}});
    // }
    async findUserRolesByUserId(user: number): Promise<UserRolesEntity[]> {
        const options: FindManyOptions<UserRolesEntity> = {
            where: { user: user } as any,
        };
        return await this.userRolesRepository.find(options);
    }

}
