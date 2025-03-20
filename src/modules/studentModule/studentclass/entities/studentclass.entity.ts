import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    OneToMany
} from "typeorm";
import {Student} from "../../student/entities/student.entity";
import {ClassSection} from "../../../academicModule/class-section/entities/class-section.entity";
import {Class} from "../../../academicModule/class/entities/class.entity";
import { Payment } from "../../../payments/entities/payment.entity";
import { StudentExamMarks } from "src/modules/exam-module/student-exam-marks/entities/student-exam-marks.entity";

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

    @OneToMany(()=>Payment,payment =>payment.studentClass)
    payment: Payment;

    @OneToMany(()=> StudentExamMarks ,studentExamMarks =>studentExamMarks.studentClass)
    studentExamMarks: StudentExamMarks;
}
