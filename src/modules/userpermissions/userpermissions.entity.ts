import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import {UserTypesEntity} from "../userTypes/entities/userTypes.entity";
import {Permission} from "../permissions/entities/permissions.entity";
import {UserEntity} from "../user/user.entity";


@Entity('userpermissions')
export class UserPermissions{
    @PrimaryGeneratedColumn()
    userpermissionid: number;

    @ManyToOne(() => UserEntity, (user) => user.userPermissions)
    @JoinColumn({ name: 'userid' })
    user: UserEntity;

    @ManyToOne(() => Permission, (permission) => permission.userPermissions)
    @JoinColumn({ name: 'permissionId' })
    permission: Permission;

}
