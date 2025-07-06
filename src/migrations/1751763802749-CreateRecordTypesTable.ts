import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRecordTypesTable1751763802749 implements MigrationInterface {
    name = 'CreateRecordTypesTable1751763802749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "record_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "icone" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_880422ee99e61c29fc7c369849d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "record_types" ADD CONSTRAINT "FK_9677255dafdc5944598b548957c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record_types" DROP CONSTRAINT "FK_9677255dafdc5944598b548957c"`);
        await queryRunner.query(`DROP TABLE "record_types"`);
    }

}
