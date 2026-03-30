import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1774879599134 implements MigrationInterface {
    name = 'InitialSchema1774879599134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."usuario_tipo_usuario_enum" AS ENUM('estudiante', 'tutor', 'gerente', 'jefe_pasantes', 'super_usuario')`);
        await queryRunner.query(`CREATE TABLE "usuario" ("id_usuario" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "apellido" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "contrasena" character varying(255) NOT NULL, "tipo_usuario" "public"."usuario_tipo_usuario_enum" NOT NULL DEFAULT 'estudiante', "nivel_acceso" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_2863682842e688ca198eb25c124" UNIQUE ("email"), CONSTRAINT "PK_dd52716c2652e0e23c15530c695" PRIMARY KEY ("id_usuario"))`);
        await queryRunner.query(`CREATE TABLE "empresa" ("id_empresa" SERIAL NOT NULL, "nombre" character varying(150) NOT NULL, "rubro" character varying(100) NOT NULL, "direccion" text NOT NULL, "telefono" character varying(20) NOT NULL, CONSTRAINT "PK_5ba2e4397739ba6b0207476c81e" PRIMARY KEY ("id_empresa"))`);
        await queryRunner.query(`CREATE TABLE "jefe_pasantes" ("id_jefe" integer NOT NULL, "departamento" character varying(150) NOT NULL, "id_empresa" integer, CONSTRAINT "PK_4325ec4b9665e8bcde5a9c2d979" PRIMARY KEY ("id_jefe"))`);
        await queryRunner.query(`CREATE TABLE "super_usuario" ("id_superusuario" integer NOT NULL, CONSTRAINT "PK_0b69b37b6c8f841f22eb2053be5" PRIMARY KEY ("id_superusuario"))`);
        await queryRunner.query(`CREATE TABLE "tutor" ("id_tutor" integer NOT NULL, "especialidad" character varying(150) NOT NULL, "institucion" character varying(200) NOT NULL, CONSTRAINT "PK_b19eaca547c0be6640cc4626044" PRIMARY KEY ("id_tutor"))`);
        await queryRunner.query(`CREATE TABLE "estudiante" ("id_estudiante" integer NOT NULL, "carrera" character varying(150) NOT NULL, "semestre" integer NOT NULL, "registro_universitario" character varying(50) NOT NULL, CONSTRAINT "UQ_246846ff83e973bb5d631b82952" UNIQUE ("registro_universitario"), CONSTRAINT "PK_6cc5c3e605bf03ab2dbc39efab5" PRIMARY KEY ("id_estudiante"))`);
        await queryRunner.query(`CREATE TABLE "gerente" ("id_gerente" integer NOT NULL, "cargo" character varying(100) NOT NULL, "carrera" character varying(150) NOT NULL, "id_empresa" integer, CONSTRAINT "PK_ac3c107f13b646482ecf607c263" PRIMARY KEY ("id_gerente"))`);
        await queryRunner.query(`CREATE TYPE "public"."pasantia_estado_enum" AS ENUM('pendiente', 'en_curso', 'finalizada', 'cancelada')`);
        await queryRunner.query(`CREATE TABLE "pasantia" ("id_pasantia" SERIAL NOT NULL, "titulo" character varying(255) NOT NULL, "descripcion" text NOT NULL, "fecha_inicio" date NOT NULL, "fecha_fin" date, "estado" "public"."pasantia_estado_enum" NOT NULL DEFAULT 'pendiente', "id_empresa" integer, CONSTRAINT "PK_78fe3d5e7e95efba822102f9ab4" PRIMARY KEY ("id_pasantia"))`);
        await queryRunner.query(`CREATE TYPE "public"."inscripcion_estado_enum" AS ENUM('pendiente', 'aprobada', 'rechazada', 'completada')`);
        await queryRunner.query(`CREATE TABLE "inscripcion" ("id_inscripcion" SERIAL NOT NULL, "fecha_inscripcion" date NOT NULL, "fecha_inicio_periodo" date, "fecha_fin_periodo" date, "estado" "public"."inscripcion_estado_enum" NOT NULL DEFAULT 'pendiente', "id_estudiante" integer, "id_pasantia" integer, "id_tutor" integer, "id_jefe" integer, CONSTRAINT "PK_27cec7c0c8485660d420f70e795" PRIMARY KEY ("id_inscripcion"))`);
        await queryRunner.query(`CREATE TABLE "comentario" ("id_comentario" SERIAL NOT NULL, "texto" text NOT NULL, "fecha" TIMESTAMP NOT NULL DEFAULT now(), "valoracion" integer NOT NULL DEFAULT '5', "id_pasantia" integer, "id_usuario" integer, CONSTRAINT "PK_ec595a4d999244c9ccfc170b3f1" PRIMARY KEY ("id_comentario"))`);
        await queryRunner.query(`CREATE TYPE "public"."actividad_estado_enum" AS ENUM('con_cupos', 'en_desarrollo', 'cerrada')`);
        await queryRunner.query(`CREATE TABLE "actividad" ("id_actividad" SERIAL NOT NULL, "descripcion" text NOT NULL, "fecha" date NOT NULL, "estado" "public"."actividad_estado_enum" NOT NULL DEFAULT 'con_cupos', "id_pasantia" integer, CONSTRAINT "PK_eaebfa80606d94d800bb093aab0" PRIMARY KEY ("id_actividad"))`);
        await queryRunner.query(`CREATE TABLE "informe_final" ("id_informe" SERIAL NOT NULL, "fecha_entrega" date NOT NULL, "contenido" text NOT NULL, "nota_final" numeric(5,2), "observaciones" text, "id_inscripcion" integer, "id_jefe" integer, CONSTRAINT "PK_8ddd0b1a19adf6b187df88dfe56" PRIMARY KEY ("id_informe"))`);
        await queryRunner.query(`CREATE TABLE "hoja_vida" ("id_hoja_vida" SERIAL NOT NULL, "resumen" text NOT NULL, "fecha_actualizacion" date NOT NULL, "id_estudiante" integer, CONSTRAINT "REL_1f5a5997c07270467c4efc9c0b" UNIQUE ("id_estudiante"), CONSTRAINT "PK_19903910ea70a5394200ff0e981" PRIMARY KEY ("id_hoja_vida"))`);
        await queryRunner.query(`CREATE TYPE "public"."habilidad_nivel_enum" AS ENUM('basico', 'intermedio', 'avanzado', 'experto')`);
        await queryRunner.query(`CREATE TABLE "habilidad" ("id_habilidad" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "nivel" "public"."habilidad_nivel_enum" NOT NULL DEFAULT 'basico', "id_hoja_vida" integer, CONSTRAINT "PK_42579a060dcb92203409dc688d9" PRIMARY KEY ("id_habilidad"))`);
        await queryRunner.query(`CREATE TABLE "bitacora" ("id_bitacora" SERIAL NOT NULL, "fecha" date NOT NULL, "contenido" text NOT NULL, "porcentaje" integer NOT NULL DEFAULT '0', "observaciones" text, "id_jefe" integer, "id_inscripcion" integer, "id_actividad" integer, CONSTRAINT "PK_b1cd973071fbe3705f5c2dba556" PRIMARY KEY ("id_bitacora"))`);
        await queryRunner.query(`ALTER TABLE "jefe_pasantes" ADD CONSTRAINT "FK_4325ec4b9665e8bcde5a9c2d979" FOREIGN KEY ("id_jefe") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jefe_pasantes" ADD CONSTRAINT "FK_56e5b8b97f5ed7ca6c4277b0428" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id_empresa") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "super_usuario" ADD CONSTRAINT "FK_0b69b37b6c8f841f22eb2053be5" FOREIGN KEY ("id_superusuario") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tutor" ADD CONSTRAINT "FK_b19eaca547c0be6640cc4626044" FOREIGN KEY ("id_tutor") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "estudiante" ADD CONSTRAINT "FK_6cc5c3e605bf03ab2dbc39efab5" FOREIGN KEY ("id_estudiante") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gerente" ADD CONSTRAINT "FK_ac3c107f13b646482ecf607c263" FOREIGN KEY ("id_gerente") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gerente" ADD CONSTRAINT "FK_02101bc0a9157226ab826881314" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id_empresa") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pasantia" ADD CONSTRAINT "FK_250fa805d2b7574ea724fcab84b" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id_empresa") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD CONSTRAINT "FK_a120e275d075aa5dc2d52241a09" FOREIGN KEY ("id_estudiante") REFERENCES "estudiante"("id_estudiante") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD CONSTRAINT "FK_1362d6917a6c1d5e47530cb6c98" FOREIGN KEY ("id_pasantia") REFERENCES "pasantia"("id_pasantia") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD CONSTRAINT "FK_de89565613128d79f8e501cdaa5" FOREIGN KEY ("id_tutor") REFERENCES "tutor"("id_tutor") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD CONSTRAINT "FK_84175dd8a0432e7a1d1ba3dad9d" FOREIGN KEY ("id_jefe") REFERENCES "jefe_pasantes"("id_jefe") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comentario" ADD CONSTRAINT "FK_86be4750915eabc44c013f118d0" FOREIGN KEY ("id_pasantia") REFERENCES "pasantia"("id_pasantia") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comentario" ADD CONSTRAINT "FK_c28516f059447f007f416d060ab" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "actividad" ADD CONSTRAINT "FK_5f902286f270a7dbd77ad10d769" FOREIGN KEY ("id_pasantia") REFERENCES "pasantia"("id_pasantia") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "informe_final" ADD CONSTRAINT "FK_44151ab43a7331df4f67a833fbd" FOREIGN KEY ("id_inscripcion") REFERENCES "inscripcion"("id_inscripcion") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "informe_final" ADD CONSTRAINT "FK_27e6cce4a41f8b86a18755d4993" FOREIGN KEY ("id_jefe") REFERENCES "jefe_pasantes"("id_jefe") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hoja_vida" ADD CONSTRAINT "FK_1f5a5997c07270467c4efc9c0b1" FOREIGN KEY ("id_estudiante") REFERENCES "estudiante"("id_estudiante") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "habilidad" ADD CONSTRAINT "FK_754f75ab1bee2f5fc2bef5910c6" FOREIGN KEY ("id_hoja_vida") REFERENCES "hoja_vida"("id_hoja_vida") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bitacora" ADD CONSTRAINT "FK_1ae0214dace2c41761c547e1829" FOREIGN KEY ("id_jefe") REFERENCES "jefe_pasantes"("id_jefe") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bitacora" ADD CONSTRAINT "FK_b018b8227fec9cb42f1a7532902" FOREIGN KEY ("id_inscripcion") REFERENCES "inscripcion"("id_inscripcion") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bitacora" ADD CONSTRAINT "FK_7e2652ea3e6c51795e8c3a5b55d" FOREIGN KEY ("id_actividad") REFERENCES "actividad"("id_actividad") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bitacora" DROP CONSTRAINT "FK_7e2652ea3e6c51795e8c3a5b55d"`);
        await queryRunner.query(`ALTER TABLE "bitacora" DROP CONSTRAINT "FK_b018b8227fec9cb42f1a7532902"`);
        await queryRunner.query(`ALTER TABLE "bitacora" DROP CONSTRAINT "FK_1ae0214dace2c41761c547e1829"`);
        await queryRunner.query(`ALTER TABLE "habilidad" DROP CONSTRAINT "FK_754f75ab1bee2f5fc2bef5910c6"`);
        await queryRunner.query(`ALTER TABLE "hoja_vida" DROP CONSTRAINT "FK_1f5a5997c07270467c4efc9c0b1"`);
        await queryRunner.query(`ALTER TABLE "informe_final" DROP CONSTRAINT "FK_27e6cce4a41f8b86a18755d4993"`);
        await queryRunner.query(`ALTER TABLE "informe_final" DROP CONSTRAINT "FK_44151ab43a7331df4f67a833fbd"`);
        await queryRunner.query(`ALTER TABLE "actividad" DROP CONSTRAINT "FK_5f902286f270a7dbd77ad10d769"`);
        await queryRunner.query(`ALTER TABLE "comentario" DROP CONSTRAINT "FK_c28516f059447f007f416d060ab"`);
        await queryRunner.query(`ALTER TABLE "comentario" DROP CONSTRAINT "FK_86be4750915eabc44c013f118d0"`);
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP CONSTRAINT "FK_84175dd8a0432e7a1d1ba3dad9d"`);
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP CONSTRAINT "FK_de89565613128d79f8e501cdaa5"`);
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP CONSTRAINT "FK_1362d6917a6c1d5e47530cb6c98"`);
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP CONSTRAINT "FK_a120e275d075aa5dc2d52241a09"`);
        await queryRunner.query(`ALTER TABLE "pasantia" DROP CONSTRAINT "FK_250fa805d2b7574ea724fcab84b"`);
        await queryRunner.query(`ALTER TABLE "gerente" DROP CONSTRAINT "FK_02101bc0a9157226ab826881314"`);
        await queryRunner.query(`ALTER TABLE "gerente" DROP CONSTRAINT "FK_ac3c107f13b646482ecf607c263"`);
        await queryRunner.query(`ALTER TABLE "estudiante" DROP CONSTRAINT "FK_6cc5c3e605bf03ab2dbc39efab5"`);
        await queryRunner.query(`ALTER TABLE "tutor" DROP CONSTRAINT "FK_b19eaca547c0be6640cc4626044"`);
        await queryRunner.query(`ALTER TABLE "super_usuario" DROP CONSTRAINT "FK_0b69b37b6c8f841f22eb2053be5"`);
        await queryRunner.query(`ALTER TABLE "jefe_pasantes" DROP CONSTRAINT "FK_56e5b8b97f5ed7ca6c4277b0428"`);
        await queryRunner.query(`ALTER TABLE "jefe_pasantes" DROP CONSTRAINT "FK_4325ec4b9665e8bcde5a9c2d979"`);
        await queryRunner.query(`DROP TABLE "bitacora"`);
        await queryRunner.query(`DROP TABLE "habilidad"`);
        await queryRunner.query(`DROP TYPE "public"."habilidad_nivel_enum"`);
        await queryRunner.query(`DROP TABLE "hoja_vida"`);
        await queryRunner.query(`DROP TABLE "informe_final"`);
        await queryRunner.query(`DROP TABLE "actividad"`);
        await queryRunner.query(`DROP TYPE "public"."actividad_estado_enum"`);
        await queryRunner.query(`DROP TABLE "comentario"`);
        await queryRunner.query(`DROP TABLE "inscripcion"`);
        await queryRunner.query(`DROP TYPE "public"."inscripcion_estado_enum"`);
        await queryRunner.query(`DROP TABLE "pasantia"`);
        await queryRunner.query(`DROP TYPE "public"."pasantia_estado_enum"`);
        await queryRunner.query(`DROP TABLE "gerente"`);
        await queryRunner.query(`DROP TABLE "estudiante"`);
        await queryRunner.query(`DROP TABLE "tutor"`);
        await queryRunner.query(`DROP TABLE "super_usuario"`);
        await queryRunner.query(`DROP TABLE "jefe_pasantes"`);
        await queryRunner.query(`DROP TABLE "empresa"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
        await queryRunner.query(`DROP TYPE "public"."usuario_tipo_usuario_enum"`);
    }

}
