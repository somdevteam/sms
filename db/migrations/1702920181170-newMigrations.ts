import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigrations1702920181170 implements MigrationInterface {
    name = 'NewMigrations1702920181170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`role_permissions1\` (\`role\` int NOT NULL, \`permission\` int NOT NULL, INDEX \`IDX_215830e7430b295359ad60d14a\` (\`role\`), INDEX \`IDX_70fae4c03ffe7a3a97f8a10191\` (\`permission\`), PRIMARY KEY (\`role\`, \`permission\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`role_permissions1\` ADD CONSTRAINT \`FK_215830e7430b295359ad60d14a1\` FOREIGN KEY (\`role\`) REFERENCES \`roles\`(\`roleId\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_permissions1\` ADD CONSTRAINT \`FK_70fae4c03ffe7a3a97f8a101914\` FOREIGN KEY (\`permission\`) REFERENCES \`permissions\`(\`PERMISSIONID\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`role_permissions1\` DROP FOREIGN KEY \`FK_70fae4c03ffe7a3a97f8a101914\``);
        await queryRunner.query(`ALTER TABLE \`role_permissions1\` DROP FOREIGN KEY \`FK_215830e7430b295359ad60d14a1\``);
        await queryRunner.query(`DROP INDEX \`IDX_70fae4c03ffe7a3a97f8a10191\` ON \`role_permissions1\``);
        await queryRunner.query(`DROP INDEX \`IDX_215830e7430b295359ad60d14a\` ON \`role_permissions1\``);
        await queryRunner.query(`DROP TABLE \`role_permissions1\``);
    }

}
