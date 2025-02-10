import { Branch } from "src/modules/branch/branch.entity";
import { Class } from "src/modules/academicModule/class/entities/class.entity";
import { Subject } from "src/modules/academicModule/subject/entities/subject.entity";
import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClassSubject extends BaseEntity{
    @PrimaryGeneratedColumn()
    class_subject_id:number;
    @ManyToOne(() => Branch, branch => branch.classSubject)
    @JoinColumn({name: 'branch_id'}) // Specify the foreign key column
    branch: Branch;

    @ManyToOne(() => Class, cls => cls.classSubject)
    @JoinColumn({name: 'class_id'}) // Specify the foreign key column
    class: Class;

    @ManyToOne(() => Subject, sub => sub.classSubject)
    @JoinColumn({name: 'subject_id'}) // Specify the foreign key column
    subject: Subject;

}
