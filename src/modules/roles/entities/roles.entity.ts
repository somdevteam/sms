import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {ClassSection} from "../../academicModule/class-section/entities/class-section.entity";
import {RolePermissionsEntity} from "../../rolePermissions/entities/rolePermissions.entity";
import {UserRolesEntity} from "../../userroles/entities/userroles.entity";

@Entity('roles')
export class RolesEntity {
    @PrimaryGeneratedColumn()
    roleId: number;

    @Column({ length: 100 })
    roleName: string;

    @Column({ length: 500 })
    description: string;

    @Column({ default: 'Y', length: 1 })
    isActive: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdBy: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateCreated: Date;
    @OneToMany(() => RolePermissionsEntity, rolePermissions => rolePermissions.role)
    rolePermissions: RolePermissionsEntity

    @OneToMany(() => UserRolesEntity, (userRoles) => userRoles.role)
    userRoles: UserRolesEntity;
}
