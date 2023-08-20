import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {isEmail, IsNotEmpty} from "class-validator";
import {UserProfile} from "./userprofile.entity";

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


}
