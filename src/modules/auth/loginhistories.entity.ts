import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/user.entity";

@Entity('login_history')
export class Loginhistories {
    @PrimaryGeneratedColumn()
    loginHistoryId: number;

    // @ManyToOne(() => UserEntity, user => user.profile)
    // @JoinColumn({name: 'userId'}) // Specify the foreign key column
    // userId: UserEntity;
    @ManyToOne(() => UserEntity, user => user.loginHistory)
    @JoinColumn({name: 'userId'}) // Specify the foreign key column
    user: UserEntity;

    @Column({nullable: true})
    userId: number;

    @Column({type: 'varchar', length: 255})
    ip: string;

    @Column({type: 'varchar', length: 255})
    browser: string;

    @Column()
    loginDate: Date;
    @Column({nullable: true})
    logoutDate: Date;

    // Other columns and methods can be added here
}
