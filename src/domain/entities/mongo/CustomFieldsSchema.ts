import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
  Index,
} from "typeorm";

export enum FieldType {
  TEXT = "text",
  NUMBER = "number",
  SELECT = "select",
  CHECKBOX = "checkbox",
  DATE = "date",
}

@Entity("custom_fields")
export class CustomField {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: FieldType,
    nullable: false,
  })
  type!: FieldType;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  label!: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    default: null,
  })
  description?: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  category_id!: string;
  @Index()
  @Column({
    type: "integer",
    nullable: false,
  })
  record_type_id!: number;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  name!: string;

  @Column({
    type: "boolean",
    default: false,
  })
  required!: boolean;
  @Index()
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
