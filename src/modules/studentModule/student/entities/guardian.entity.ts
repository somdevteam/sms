import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "../../student/entities/student.entity";

@Entity()

export class Guardian extends BaseEntity {
    @PrimaryGeneratedColumn()
    guardianId: number;

    @Column()
    guardianName: string;

    @Column()
    phone: string;
    
    @OneToMany(() => Student, student => student.guardian)
    student: Student[];

}
