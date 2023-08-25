import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {isEmail, IsNotEmpty} from "class-validator";
import { Level } from "../academicModule/level/entities/level.entity";
import { Levelclass } from "src/modules/academicModule/levelclass/entities/levelclass.entity";
import { ClassSubject } from "../academicModule/class-subject/entities/class-subject.entity";
import { ClassSection } from "../academicModule/class-section/entities/class-section.entity";

@Entity('branch')
export class Branch extends BaseEntity {
    @PrimaryGeneratedColumn()
    branchid: number;
    @Column()
    @Unique(['branchname'])
    branchname: string;
    @Column()
    branchlocation: string;
    @Column({nullable:true})
    branchlogo: string;
    @Column({nullable: true})
    coverlogo: string;
    @Column()
    datecreated: Date;
    @Column({default: true})
    isactive: boolean;
    @OneToMany(() => Levelclass, levelclass => levelclass.branch)
    levelclass: Levelclass[]
    @OneToMany(() => ClassSubject, clssub => clssub.branch)
    classSubject: ClassSubject
    @OneToMany(() => ClassSection, clsSec => clsSec.branch)
    classSection: ClassSection

}