import { MigrationInterface, QueryRunner } from "typeorm";

export class RestaurarCarreraEstudiante1778453625317 implements MigrationInterface {
    name = 'RestaurarCarreraEstudiante1778453625317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "estudiante" ADD "carrera" character varying(150) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "estudiante" DROP COLUMN "carrera"`);
    }

}
