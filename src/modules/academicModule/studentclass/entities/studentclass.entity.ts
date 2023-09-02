import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, ManyToOne, JoinColumn} from 'typeorm';
import {Student} from "../../../studentModule/student/entities/student.entity";
import {ClassSection} from "../../class-section/entities/class-section.entity";
import {Class} from "../../class/entities/class.entity";

@Entity()
export class StudentClass extends BaseEntity{
    @PrimaryGeneratedColumn()
    studentClassId: number;

    @ManyToOne(()=>ClassSection, classSection =>classSection.studentClass)
    @JoinColumn({name:"classsectionid"})
    classSection: ClassSection;

    @ManyToOne(() => Student, student => student.studentClass)
    @JoinColumn({name:'studentid'})
    student: Student;
    @Column()
    dateCreated: Date;
}
