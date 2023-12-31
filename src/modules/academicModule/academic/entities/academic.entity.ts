import { ClassSection } from "src/modules/academicModule/class-section/entities/class-section.entity";
import { AcademicBranch } from "src/modules/branch-academic/entities/branch-academic.entity";
import { Branch } from "src/modules/branch/branch.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";




@Entity('academics')
export class AcademicEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  academicId: number;

  @Column()
  academicYear: string;

  @OneToMany(() => AcademicBranch, (academicBranch) => academicBranch.academic)
  academicBranches: AcademicBranch[];

  @Column()
  dateCreated: Date;
  @Column({default: false})
  isActive: boolean;
}
