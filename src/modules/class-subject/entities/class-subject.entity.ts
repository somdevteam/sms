import { Branch } from "src/modules/branch/branch.entity";
import { Class } from "src/modules/class/entities/class.entity";
import { Subject } from "src/modules/subject/entities/subject.entity";
import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClassSubject extends BaseEntity{
    @PrimaryGeneratedColumn()
    classSubjectId:number;
    @ManyToOne(() => Branch, branch => branch.classSubject)
    @JoinColumn({name: 'branchid'}) // Specify the foreign key column
    branch: Branch;

    @ManyToOne(() => Class, cls => cls.classSubject)
    @JoinColumn({name: 'classid'}) // Specify the foreign key column
    class: Class;

    @ManyToOne(() => Subject, sub => sub.classSubject)
    @JoinColumn({name: 'subjectid'}) // Specify the foreign key column
    subject: Subject;

}
