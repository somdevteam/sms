import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {RolePermissionsEntity} from "../../rolePermissions/entities/rolePermissions.entity";
import {UserTypePermissions} from "../../usertypepermissions/usertypepermissions.entity";

@Entity('usertypes')
export class UserTypesEntity {
    @PrimaryGeneratedColumn()
    userTypeId: number;

    @Column({ length: 500 })
    description: string;
    @OneToMany(() => UserTypePermissions, userTypePermissions => userTypePermissions.userType)
    userTypePermissions: UserTypePermissions
}
