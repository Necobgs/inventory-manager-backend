import { MigrationInterface, QueryRunner } from "typeorm";

export class Category1763074752712 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO categories (title, description, enabled, color) VALUES
        ('Eletrônicos', 'Produtos eletrônicos e gadgets em geral', true, '#1E90FF'),
        ('Eletrodomésticos', 'Itens para casa e utilidades domésticas', true, '#32CD32'),
        ('Vestuário', 'Roupas, calçados e acessórios de moda', true, '#FF69B4'),
        ('Esportes', 'Artigos esportivos e equipamentos de atividade física', true, '#FFA500'),
        ('Informática', 'Computadores, periféricos e acessórios de TI', true, '#8A2BE2'),
        ('Beleza e Saúde', 'Produtos estéticos, cosméticos e cuidados pessoais', true, '#FF6347');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM categories WHERE title IN (
        'Eletrônicos',
        'Eletrodomésticos',
        'Vestuário',
        'Esportes',
        'Informática',
        'Beleza e Saúde'
      );
    `);
  }


}
