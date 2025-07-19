import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Paymenttypes {
  @PrimaryGeneratedColumn()
  paymenttypeid: number;

  @Column()
  type: string;
  }
