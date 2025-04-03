import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {isEmail, IsNotEmpty} from "class-validator";
import { Level } from "../academicModule/level/entities/level.entity";
import { Levelclass } from "src/modules/academicModule/levelclass/entities/levelclass.entity";
import { ClassSubject } from "../academicModule/class-subject/entities/class-subject.entity";
import { ClassSection } from "../academicModule/class-section/entities/class-section.entity";
import { AcademicBranch } from "../branch-academic/entities/branch-academic.entity";
import { Student } from "../studentModule/student/entities/student.entity";
@Entity()
export class Branch  extends BaseEntity{
  @PrimaryGeneratedColumn()
  branchId: number;

  @Column()
  @Unique(['branchname'])
  branchName: string;
  @Column()
  branchLocation: string;
  @Column({nullable:true})
  branchLogo: string;
  @Column({nullable: true})
  coverLogo: string;
  @Column()
  dateCreated: Date;
  @Column({default: true})
  isActive: boolean;
  @OneToMany(() => Levelclass, levelclass => levelclass.branch)
  levelclass: Levelclass[]
  @OneToMany(() => ClassSubject, clssub => clssub.branch)
  classSubject: ClassSubject

  @OneToMany(() => AcademicBranch, (academicBranch) => academicBranch.branch)
  academicBranches: AcademicBranch[];

  @OneToMany(() => Student, student => student.branch)
  student: Student
}
