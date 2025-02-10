import { ClassSection } from "src/modules/academicModule/class-section/entities/class-section.entity";
import { ClassSubject } from "src/modules/academicModule/class-subject/entities/class-subject.entity";
import { Levelclass } from "src/modules/academicModule/levelclass/entities/levelclass.entity";
import { ClassExam } from "src/modules/examModule/exams/entities/class-exam.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Class extends BaseEntity {
    @PrimaryGeneratedColumn()
    classid: number;
    @Column()
    classname: string;
    @Column()
    datecreated: Date;
    @Column({default: true})
    isactive: boolean;
    @OneToMany(() => Levelclass, levelclass => levelclass.class)
    levelclass: Levelclass[]

    @OneToMany(() => ClassSubject, clsSub => clsSub.class)
    classSubject: ClassSubject
    @OneToMany(() => ClassSection, clsSec => clsSec.class)
    classSection: ClassSection[]

    @OneToMany(() => ClassExam, classExam => classExam.class)
    classExams: ClassExam[];

}
