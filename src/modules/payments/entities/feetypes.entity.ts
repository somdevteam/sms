import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Feetypes {
  @PrimaryGeneratedColumn()
  feetypeid: number;

  @Column()
  description: string;

  @Column('decimal', {nullable:true})
  amount: number;
}
