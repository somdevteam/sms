import { AcademicEntity } from 'src/modules/academicModule/academic/entities/academic.entity';
import { ClassSection } from 'src/modules/academicModule/class-section/entities/class-section.entity';
import { Branch } from 'src/modules/branch/branch.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, Column } from 'typeorm';

@Entity()
export class BranchAcademic {
  @PrimaryGeneratedColumn()
  branchAcademicId: number;

  // @ManyToOne(() => Branch, (branch) => branch.branchAcademics)
  // @JoinColumn({name: 'branchId'}) 
  // branch: Branch;

  // @ManyToOne(() => AcademicEntity, (academic) => academic.branchAcademics)
  // @JoinColumn({name: 'academicId'}) 
  // academic: AcademicEntity;

  @ManyToOne(() => Branch, (branch) => branch.branchAcademics)
  branch: Branch;

  @ManyToOne(() => AcademicEntity, (academic) => academic.branchAcademics)
  academic: AcademicEntity;

  @Column({default: true})
  isActive:boolean


  @OneToMany(() => ClassSection, (classSection) => classSection.branchAcademic)
  classSections: ClassSection; // Define the reverse relationship
  
}
