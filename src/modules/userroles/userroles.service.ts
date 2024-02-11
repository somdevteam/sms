import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {FindManyOptions, Repository} from 'typeorm';
import { UserRolesEntity } from './entities/userroles.entity';
import { RolesService } from '../roles/roles.service';
import { UserService } from '../user/user.service';

@Injectable()
export class UserRolesService {
    constructor(
      @InjectRepository(UserRolesEntity)
      private readonly userRolesRepository: Repository<UserRolesEntity>,
      private readonly roleService: RolesService,
      @Inject(forwardRef(() => UserService))
      private readonly userService: UserService,
    ) {}

    async findAllUserRoles(): Promise<UserRolesEntity[]> {
        return await this.userRolesRepository.find();
    }


    async createUserRole(roleId: number, userId: number): Promise<UserRolesEntity> {
        const role = await this.roleService.getRoleById(roleId);
        const user = await this.userService.getById(userId);
        
        const userRole = new UserRolesEntity()
        userRole.role = role;
        userRole.user = user;
        
        return await this.userRolesRepository.save(userRole);
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
