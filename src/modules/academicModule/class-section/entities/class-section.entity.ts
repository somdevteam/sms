import { AcademicEntity } from "src/modules/academicModule/academic/entities/academic.entity";
import { Branch } from "src/modules/branch/branch.entity";
import { Class } from "src/modules/academicModule/class/entities/class.entity";
import { Section } from "src/modules/academicModule/section/entities/section.entity";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {StudentClass} from "../../../studentModule/studentclass/entities/studentclass.entity";
import { AcademicBranch } from "src/modules/branch-academic/entities/branch-academic.entity";

@Entity()
export class ClassSection {
    @PrimaryGeneratedColumn()
    classSectionId:number;

    @ManyToOne(() => Class, cls => cls.classSection)
    @JoinColumn({name: 'classId'}) // Specify the foreign key column
    class: Class;

    @ManyToOne(() => Section, sec => sec.classSection)
    @JoinColumn({name: 'sectionId'}) // Specify the foreign key column
    section: Section;
    @Column()
    dateCreated: Date
    @OneToMany(()=>StudentClass,studentClass =>studentClass.classSection)
    @JoinColumn({name: 'studentClassId'})
    studentClass:StudentClass;

    @ManyToOne(() => AcademicBranch, (branchAcademic) => branchAcademic.classSections)
    @JoinColumn({ name: 'branchAcademicId' }) // Specify the foreign key column name
    branchAcademic: AcademicBranch;

}
