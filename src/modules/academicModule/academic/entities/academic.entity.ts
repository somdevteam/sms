import { ClassSection } from "src/modules/academicModule/class-section/entities/class-section.entity";
import { AcademicBranch } from "src/modules/branch-academic/entities/branch-academic.entity";
import { Branch } from "src/modules/branch/branch.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";




@Entity('academics')
export class AcademicEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  academicId: number;

  @Column()
  academicName: string;

  @OneToMany(() => AcademicBranch, (academicBranch) => academicBranch.academic)
  academicBranches: AcademicBranch[];

  @Column()
  datecreated: Date;
  @Column({default: false})
  isactive: boolean;
}
