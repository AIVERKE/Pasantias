import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLogoUrl1777861978390 implements MigrationInterface {
    name = 'AddLogoUrl1777861978390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "informacion_empresa" ADD "logo_url" character varying(500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "informacion_empresa" DROP COLUMN "logo_url"`);
    }

}
