import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
    RelationOptions,
    ManyToMany, JoinTable, OneToMany,
} from 'typeorm';
import {Tab} from '../../tabs/entities/tabs.entity';
import {ClassSection} from "../../academicModule/class-section/entities/class-section.entity";
import {RolePermissionsEntity} from "../../rolePermissions/entities/rolePermissions.entity";
import {UserTypePermissions} from "../../usertypepermissions/usertypepermissions.entity";
import {UserPermissions} from "../../userpermissions/userpermissions.entity";

@Entity('permissions')
export class Permission extends BaseEntity {
    @PrimaryGeneratedColumn({name: 'PERMISSIONID'})
    permissionId: number;

    @Column({name: 'PERMISSION', length: 150})
    permission: string;

    @Column({name: 'DESCRIPTION', length: 200})
    description: string;

    @Column({name: 'CREATEDBY'})
    createdBy: number;

    @CreateDateColumn({name: 'DATECREATED'})
    dateCreated: Date;

    @Column({name: 'ISACTIVE'})
    isActive: string;

    // @ManyToMany(() => Tab, (tab) => tab.permissions)
    @JoinTable({name: 'tabpermissions', joinColumn: {name: 'PERMISSIONID'}, inverseJoinColumn: {name: 'TABID'}})
    tabPermissions: Tab[];
    @OneToMany(() => RolePermissionsEntity, rolePermissions => rolePermissions.role)
    rolePermissions: RolePermissionsEntity
    @OneToMany(() => UserTypePermissions, userTypePermission => userTypePermission.permission)
    userTypePermissions: UserTypePermissions

    @OneToMany(() => UserPermissions, userPermissions => userPermissions.permission)
    userPermissions: UserPermissions
}
