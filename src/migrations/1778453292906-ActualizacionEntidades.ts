import { MigrationInterface, QueryRunner } from "typeorm";

export class ActualizacionEntidades1778453292906 implements MigrationInterface {
    name = 'ActualizacionEntidades1778453292906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habilidad" DROP CONSTRAINT "FK_754f75ab1bee2f5fc2bef5910c6"`);
        await queryRunner.query(`ALTER TABLE "bitacora" DROP CONSTRAINT "FK_7e2652ea3e6c51795e8c3a5b55d"`);
        await queryRunner.query(`CREATE TABLE "mencion" ("id_mencion" SERIAL NOT NULL, "nombre_mencion" character varying(150) NOT NULL, CONSTRAINT "PK_cde905532885f1ff51a1c4c22b3" PRIMARY KEY ("id_mencion"))`);
        await queryRunner.query(`CREATE TABLE "historial_academico" ("id_historial" SERIAL NOT NULL, "titulo" character varying(255) NOT NULL, "institucion" character varying(150) NOT NULL, "fecha_emision" date NOT NULL, "url_certificado" character varying(255), "id_estudiante" integer, CONSTRAINT "PK_49d23e28dfbf772df6836ac9e01" PRIMARY KEY ("id_historial"))`);
        await queryRunner.query(`CREATE TABLE "evaluacion_final" ("id_evaluacion" SERIAL NOT NULL, "crit_conocimiento_tecnico" integer NOT NULL, "crit_responsabilidad" integer NOT NULL, "crit_trabajo_equipo" integer NOT NULL, "crit_iniciativa" integer NOT NULL, "evaluacion_cualitativa" text NOT NULL, "comentario_estudiante" text, "valoracion_estrellas" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "id_inscripcion" integer, CONSTRAINT "REL_70517134e56232f03c76722c24" UNIQUE ("id_inscripcion"), CONSTRAINT "PK_19cb2883eb1b8348364818600a9" PRIMARY KEY ("id_evaluacion"))`);
        await queryRunner.query(`CREATE TYPE "public"."actividad_bitacora_estado_semaforo_enum" AS ENUM('pendiente', 'en_curso', 'completada', 'no_completada')`);
        await queryRunner.query(`CREATE TABLE "actividad_bitacora" ("id_actividad" SERIAL NOT NULL, "titulo_actividad" character varying(255) NOT NULL, "descripcion_actividad" text NOT NULL, "fecha_asignacion" TIMESTAMP NOT NULL, "estado_semaforo" "public"."actividad_bitacora_estado_semaforo_enum" NOT NULL DEFAULT 'pendiente', "nota_actividad" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "id_inscripcion" integer, "id_jefe_asignador" integer, CONSTRAINT "PK_4ac709a3f8aca749be16f378fb6" PRIMARY KEY ("id_actividad"))`);
        await queryRunner.query(`CREATE TYPE "public"."habilidad_old_nivel_enum" AS ENUM('basico', 'intermedio', 'avanzado', 'experto')`);
        await queryRunner.query(`CREATE TABLE "habilidad_old" ("id_habilidad" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "nivel" "public"."habilidad_old_nivel_enum" NOT NULL DEFAULT 'basico', "id_hoja_vida" integer, CONSTRAINT "PK_db751766dd39671d4d193947e4a" PRIMARY KEY ("id_habilidad"))`);
        await queryRunner.query(`CREATE TABLE "estudiante_habilidad" ("id_estudiante" integer NOT NULL, "id_habilidad" integer NOT NULL, CONSTRAINT "PK_8a9016e2405146e9d8761499033" PRIMARY KEY ("id_estudiante", "id_habilidad"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fad2b304d730b7fe050ef5a5b7" ON "estudiante_habilidad" ("id_estudiante") `);
        await queryRunner.query(`CREATE INDEX "IDX_df1653875898bda455b2e9a688" ON "estudiante_habilidad" ("id_habilidad") `);
        await queryRunner.query(`CREATE TABLE "pasantia_habilidad" ("id_pasantia" integer NOT NULL, "id_habilidad" integer NOT NULL, CONSTRAINT "PK_b292c146272fb5ad14e0b14e82a" PRIMARY KEY ("id_pasantia", "id_habilidad"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bc2d740ba7cc2c05ed8784d6a0" ON "pasantia_habilidad" ("id_pasantia") `);
        await queryRunner.query(`CREATE INDEX "IDX_7b0c2548a301b30cecac617f25" ON "pasantia_habilidad" ("id_habilidad") `);
        await queryRunner.query(`ALTER TABLE "habilidad" DROP COLUMN "nivel"`);
        await queryRunner.query(`DROP TYPE "public"."habilidad_nivel_enum"`);
        await queryRunner.query(`ALTER TABLE "habilidad" DROP COLUMN "id_hoja_vida"`);
        await queryRunner.query(`ALTER TABLE "habilidad" DROP COLUMN "nombre"`);
        await queryRunner.query(`ALTER TABLE "estudiante" DROP COLUMN "carrera"`);
        await queryRunner.query(`ALTER TABLE "habilidad" ADD "categoria_habilidad" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "habilidad" ADD "nombre_habilidad" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "estudiante" ADD "url_foto_perfil" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "estudiante" ADD "url_ci_anverso" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "estudiante" ADD "url_ci_reverso" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "estudiante" ADD "url_matricula" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "estudiante" ADD "id_mencion" integer`);
        await queryRunner.query(`CREATE TYPE "public"."inscripcion_estado_ejecucion_enum" AS ENUM('en_curso', 'finalizada', 'abandonada')`);
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD "estado_ejecucion" "public"."inscripcion_estado_ejecucion_enum"`);
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD "comentario_jefe" text`);
        await queryRunner.query(`ALTER TABLE "pasantia" ADD "horario_laboral" character varying(150)`);
        await queryRunner.query(`ALTER TABLE "pasantia" ADD "cupos_totales" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "empresa" ADD "url_logo" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "estudiante" ADD CONSTRAINT "FK_6c8527fbf6e769b1698eafad43d" FOREIGN KEY ("id_mencion") REFERENCES "mencion"("id_mencion") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "historial_academico" ADD CONSTRAINT "FK_24c6379678a071c8502ab14e043" FOREIGN KEY ("id_estudiante") REFERENCES "estudiante"("id_estudiante") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evaluacion_final" ADD CONSTRAINT "FK_70517134e56232f03c76722c24c" FOREIGN KEY ("id_inscripcion") REFERENCES "inscripcion"("id_inscripcion") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "actividad_bitacora" ADD CONSTRAINT "FK_da1b2eda21804d287b6af016d22" FOREIGN KEY ("id_inscripcion") REFERENCES "inscripcion"("id_inscripcion") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "actividad_bitacora" ADD CONSTRAINT "FK_ad70a8988d31c6dd8fcceb80ff0" FOREIGN KEY ("id_jefe_asignador") REFERENCES "jefe_pasantes"("id_jefe") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "habilidad_old" ADD CONSTRAINT "FK_9c40e7bee45acb13ce6fc39954e" FOREIGN KEY ("id_hoja_vida") REFERENCES "hoja_vida"("id_hoja_vida") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bitacora" ADD CONSTRAINT "FK_7e2652ea3e6c51795e8c3a5b55d" FOREIGN KEY ("id_actividad") REFERENCES "actividad_bitacora"("id_actividad") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "estudiante_habilidad" ADD CONSTRAINT "FK_fad2b304d730b7fe050ef5a5b74" FOREIGN KEY ("id_estudiante") REFERENCES "estudiante"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "estudiante_habilidad" ADD CONSTRAINT "FK_df1653875898bda455b2e9a6886" FOREIGN KEY ("id_habilidad") REFERENCES "habilidad"("id_habilidad") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pasantia_habilidad" ADD CONSTRAINT "FK_bc2d740ba7cc2c05ed8784d6a0b" FOREIGN KEY ("id_pasantia") REFERENCES "pasantia"("id_pasantia") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pasantia_habilidad" ADD CONSTRAINT "FK_7b0c2548a301b30cecac617f256" FOREIGN KEY ("id_habilidad") REFERENCES "habilidad"("id_habilidad") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pasantia_habilidad" DROP CONSTRAINT "FK_7b0c2548a301b30cecac617f256"`);
        await queryRunner.query(`ALTER TABLE "pasantia_habilidad" DROP CONSTRAINT "FK_bc2d740ba7cc2c05ed8784d6a0b"`);
        await queryRunner.query(`ALTER TABLE "estudiante_habilidad" DROP CONSTRAINT "FK_df1653875898bda455b2e9a6886"`);
        await queryRunner.query(`ALTER TABLE "estudiante_habilidad" DROP CONSTRAINT "FK_fad2b304d730b7fe050ef5a5b74"`);
        await queryRunner.query(`ALTER TABLE "bitacora" DROP CONSTRAINT "FK_7e2652ea3e6c51795e8c3a5b55d"`);
        await queryRunner.query(`ALTER TABLE "habilidad_old" DROP CONSTRAINT "FK_9c40e7bee45acb13ce6fc39954e"`);
        await queryRunner.query(`ALTER TABLE "actividad_bitacora" DROP CONSTRAINT "FK_ad70a8988d31c6dd8fcceb80ff0"`);
        await queryRunner.query(`ALTER TABLE "actividad_bitacora" DROP CONSTRAINT "FK_da1b2eda21804d287b6af016d22"`);
        await queryRunner.query(`ALTER TABLE "evaluacion_final" DROP CONSTRAINT "FK_70517134e56232f03c76722c24c"`);
        await queryRunner.query(`ALTER TABLE "historial_academico" DROP CONSTRAINT "FK_24c6379678a071c8502ab14e043"`);
        await queryRunner.query(`ALTER TABLE "estudiante" DROP CONSTRAINT "FK_6c8527fbf6e769b1698eafad43d"`);
        await queryRunner.query(`ALTER TABLE "empresa" DROP COLUMN "url_logo"`);
        await queryRunner.query(`ALTER TABLE "pasantia" DROP COLUMN "cupos_totales"`);
        await queryRunner.query(`ALTER TABLE "pasantia" DROP COLUMN "horario_laboral"`);
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP COLUMN "comentario_jefe"`);
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP COLUMN "estado_ejecucion"`);
        await queryRunner.query(`DROP TYPE "public"."inscripcion_estado_ejecucion_enum"`);
        await queryRunner.query(`ALTER TABLE "estudiante" DROP COLUMN "id_mencion"`);
        await queryRunner.query(`ALTER TABLE "estudiante" DROP COLUMN "url_matricula"`);
        await queryRunner.query(`ALTER TABLE "estudiante" DROP COLUMN "url_ci_reverso"`);
        await queryRunner.query(`ALTER TABLE "estudiante" DROP COLUMN "url_ci_anverso"`);
        await queryRunner.query(`ALTER TABLE "estudiante" DROP COLUMN "url_foto_perfil"`);
        await queryRunner.query(`ALTER TABLE "habilidad" DROP COLUMN "nombre_habilidad"`);
        await queryRunner.query(`ALTER TABLE "habilidad" DROP COLUMN "categoria_habilidad"`);
        await queryRunner.query(`ALTER TABLE "estudiante" ADD "carrera" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "habilidad" ADD "nombre" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "habilidad" ADD "id_hoja_vida" integer`);
        await queryRunner.query(`CREATE TYPE "public"."habilidad_nivel_enum" AS ENUM('basico', 'intermedio', 'avanzado', 'experto')`);
        await queryRunner.query(`ALTER TABLE "habilidad" ADD "nivel" "public"."habilidad_nivel_enum" NOT NULL DEFAULT 'basico'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7b0c2548a301b30cecac617f25"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc2d740ba7cc2c05ed8784d6a0"`);
        await queryRunner.query(`DROP TABLE "pasantia_habilidad"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df1653875898bda455b2e9a688"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fad2b304d730b7fe050ef5a5b7"`);
        await queryRunner.query(`DROP TABLE "estudiante_habilidad"`);
        await queryRunner.query(`DROP TABLE "habilidad_old"`);
        await queryRunner.query(`DROP TYPE "public"."habilidad_old_nivel_enum"`);
        await queryRunner.query(`DROP TABLE "actividad_bitacora"`);
        await queryRunner.query(`DROP TYPE "public"."actividad_bitacora_estado_semaforo_enum"`);
        await queryRunner.query(`DROP TABLE "evaluacion_final"`);
        await queryRunner.query(`DROP TABLE "historial_academico"`);
        await queryRunner.query(`DROP TABLE "mencion"`);
        await queryRunner.query(`ALTER TABLE "bitacora" ADD CONSTRAINT "FK_7e2652ea3e6c51795e8c3a5b55d" FOREIGN KEY ("id_actividad") REFERENCES "actividad"("id_actividad") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "habilidad" ADD CONSTRAINT "FK_754f75ab1bee2f5fc2bef5910c6" FOREIGN KEY ("id_hoja_vida") REFERENCES "hoja_vida"("id_hoja_vida") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
