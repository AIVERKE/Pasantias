import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInformacionEmpresaTable1776259836243 implements MigrationInterface {
    name = 'CreateInformacionEmpresaTable1776259836243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "informacion_empresa" ("id" SERIAL NOT NULL, "mision" character varying NOT NULL, "vision" character varying NOT NULL, "objetivos" character varying NOT NULL, "quienes_somos" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_d03d43d16c3138366109c936a79" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "informacion_empresa"`);
    }

}
