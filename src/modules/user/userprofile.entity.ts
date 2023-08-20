import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, Unique} from 'typeorm';
import {Branch} from "../branch/branch.entity";
import {UserEntity} from "./user.entity";

@Entity('user_profiles')
export class UserProfile {
    @PrimaryGeneratedColumn()
    userProfileId: number;

    @Column({type: 'varchar', length: 255})
    firstName: string;

    @Column({type: 'varchar', length: 255})
    lastName: string;

    @Column({type: 'varchar', length: 255})
    middleName: string;

    @Column()
    @Unique(['mobile'])
    mobile: number;

    @Column({nullable:true})
    branchId: number;

    @OneToOne(() => UserEntity, user => user.profile)
    @JoinColumn({name: 'userId'}) // Specify the foreign key column
    user: UserEntity;

    @Column()
    datecreated: Date;
    @Column()
    dateModified: Date;

    // Other columns and methods can be added here
}
