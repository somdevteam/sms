import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { StudentClass } from "./student-class.entity";
import { UserEntity } from "src/modules/user/user.entity";




@Entity('attendance')
export class StudentAttendance extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StudentClass, stdClass => stdClass.studentAttendance)
    @JoinColumn({name: 'studentClassId'})
    studentClass: StudentClass;

    @Column()
    status: string;
  
    @Column({ type: 'text', nullable: true })
    remark?: string;

    @ManyToOne(() => UserEntity, { eager: true })
    @JoinColumn({ name: 'recordedBy' })
    recorded_by: UserEntity;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;
    
}
