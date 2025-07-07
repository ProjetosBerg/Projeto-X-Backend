import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from "typeorm";

@Entity("transaction_custom_field_values")
export class TransactionCustomFieldValue {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({
    type: "varchar",
    nullable: false,
  })
  transaction_id!: string;

  @Index()
  @Column({
    type: "varchar",
    nullable: false,
  })
  custom_field_id!: string;

  @Column({
    type: "jsonb",
    nullable: false,
  })
  value: any;

  @Column({
    type: "varchar",
    nullable: false,
  })
  user_id!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }
}
