import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique
} from "typeorm";
import {isEmail, IsNotEmpty} from "class-validator";
import {UserProfile} from "./userprofile.entity";
import {Loginhistories} from "../auth/loginhistories.entity";
import {UserTypePermissions} from "../usertypepermissions/usertypepermissions.entity";
import {UserPermissions} from "../userpermissions/userpermissions.entity";
import {UserRolesEntity} from "../userroles/entities/userroles.entity";

@Entity('user')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    userId: number;
    @Column()
    @Unique(['email'])
    email: string;
    @Column()
    @Unique(['username'])
    username: string;
    @Column()
    password: string;
    @Column({default: true})
    isActive: boolean;
    @Column()
    datecreated: Date;
    @Column()
    dateModified: Date;
    @OneToOne(() => UserProfile, profile => profile.user)
    profile: UserProfile;

    @OneToMany(() => Loginhistories, loginHistory => loginHistory.user)
    loginHistory:Loginhistories[];
    @OneToMany(() => UserPermissions, userPermission => userPermission.user)
    userPermissions: UserPermissions

    @OneToOne(() => UserRolesEntity, (userRoles) => userRoles.user)
    userRoles: UserRolesEntity;

}
