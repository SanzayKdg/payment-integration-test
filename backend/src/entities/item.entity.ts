import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "items" })
export class Items {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  category: string;

  @CreateDateColumn()
  created_at: Date;
}
