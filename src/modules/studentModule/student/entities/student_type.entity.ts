import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "./student.entity";

@Entity('student_type')
export class StudentType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    description: string;

    @OneToMany(() => Student, student => student.studentType)
    students: Student[];
}