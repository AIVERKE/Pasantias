import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAreaPasantia1778461497191 implements MigrationInterface {
    name = 'AddAreaPasantia1778461497191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pasantia" ADD "area" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pasantia" DROP COLUMN "area"`);
    }

}
