import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1751675356076 implements MigrationInterface {
    name = 'CreateUsersTable1751675356076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "security_questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying(255) NOT NULL, "answer" character varying(255) NOT NULL, "userId" uuid, CONSTRAINT "PK_40863dac02e72e1ea928b07d5ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "security_questions" ADD CONSTRAINT "FK_fc31b5460e57c3607cc78021f5e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "security_questions" DROP CONSTRAINT "FK_fc31b5460e57c3607cc78021f5e"`);
        await queryRunner.query(`DROP TABLE "security_questions"`);
    }

}
