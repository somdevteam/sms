import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity} from 'typeorm';

@Entity()
export class StudentClass extends BaseEntity{
    @PrimaryGeneratedColumn()
    studentClassId: number;
    @Column()
    studentId: number;
    @Column()
    classSectionId: number;
    @CreateDateColumn()
    dateCreated: Date;
}
