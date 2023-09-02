import { AcademicEntity } from "src/modules/academicModule/academic/entities/academic.entity";
import { Branch } from "src/modules/branch/branch.entity";
import { Class } from "src/modules/academicModule/class/entities/class.entity";
import { Section } from "src/modules/academicModule/section/entities/section.entity";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {StudentClass} from "../../studentclass/entities/studentclass.entity";

@Entity()
export class ClassSection {
    @PrimaryGeneratedColumn()
    classSectionId:number;
    @ManyToOne(() => Branch, branch => branch.classSection)
    @JoinColumn({name: 'branchid'}) // Specify the foreign key column
    branch: Branch;

    @ManyToOne(() => Class, cls => cls.classSection)
    @JoinColumn({name: 'classid'}) // Specify the foreign key column
    class: Class;

    @ManyToOne(() => Section, sec => sec.classSection)
    @JoinColumn({name: 'sectionid'}) // Specify the foreign key column
    section: Section;
    @ManyToOne(() => AcademicEntity, aca => aca.classSection)
    @JoinColumn({name: 'academicid'}) // Specify the foreign key column
    academic: AcademicEntity;
    @Column()
    dateCreated: Date
    @OneToMany(()=>StudentClass,studentClass =>studentClass.classSection)
    @JoinColumn({name: 'studentClassId'})
    studentClass:StudentClass;
}
