import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import {UserTypesEntity} from "../userTypes/entities/userTypes.entity";
import {Permission} from "../permissions/entities/permissions.entity";


@Entity('usertypepermissions')
export class UserTypePermissions{
    @PrimaryGeneratedColumn()
    usertypepermissionid: number;

    @ManyToOne(() => UserTypesEntity, (userType) => userType.userTypePermissions)
    @JoinColumn({ name: 'userTypeId' })
    userType: UserTypesEntity;

    @ManyToOne(() => Permission, (permission) => permission.userTypePermissions)
    @JoinColumn({ name: 'permissionId' })
    permission: Permission;

}
