import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Months{
  @PrimaryGeneratedColumn()
  monthid: number;

  @Column({unique:true})
  monthname: string;

}
