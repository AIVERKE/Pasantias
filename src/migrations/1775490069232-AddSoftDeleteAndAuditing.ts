import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteAndAuditing1775490069232 implements MigrationInterface {
    name = 'AddSoftDeleteAndAuditing1775490069232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "empresa" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "empresa" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "empresa" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "pasantia" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pasantia" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pasantia" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "pasantia" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "pasantia" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "pasantia" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "empresa" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "empresa" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "empresa" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "created_at"`);
    }

}
