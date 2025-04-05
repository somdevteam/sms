import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "../../student/entities/student.entity";

@Entity()

export class Responsible extends  BaseEntity {
    @PrimaryGeneratedColumn()
    responsibleid: number;

    @Column()
    responsiblename: string;

    @Column()
    phone: string;
    
    @OneToMany(() => Student, student => student.responsible)
    student: Student[];

}
