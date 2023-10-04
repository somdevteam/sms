
import { AcademicEntity } from 'src/modules/academicModule/academic/entities/academic.entity';
import { ClassSection } from 'src/modules/academicModule/class-section/entities/class-section.entity';
import { Branch } from 'src/modules/branch/branch.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, Column } from 'typeorm';


@Entity()
export class AcademicBranch {
  @PrimaryGeneratedColumn()
  academicBranchId: number;

  @ManyToOne(() => AcademicEntity, (academic) => academic.academicBranches)
  @JoinColumn({ name: 'academicId' })
  academic: AcademicEntity;

  @ManyToOne(() => Branch, (branch) => branch.academicBranches)
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  @OneToMany(() => ClassSection, (classSection) => classSection.branchAcademic)
  classSections: ClassSection; // Define the reverse relationship

  @Column({default: true})
  isActive:boolean
}

