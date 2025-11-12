import {
  DataSource,
  EntityTarget,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { applyFilters, Filter } from './apply-filters';
import { FilterDto } from './filter-dto';

export abstract class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  constructor(
    readonly target: EntityTarget<T>,
    dataSource: DataSource,
  ) {
    super(target, dataSource.manager);
  }

  async filterExists(filter: Filter): Promise<boolean> {
    return this.getFilteredQueryBuilder(filter).getExists();
  }

  async filterOne(filter: Filter): Promise<T | null> {
    return (await this.getFilteredQueryBuilder(filter).getOne()) ?? null;
  }

  async filterAll(filter?: Filter | FilterDto): Promise<T[]> {
    return this.getFilteredQueryBuilder(filter).getMany();
  }

  private getFilteredQueryBuilder(filter?: Filter | FilterDto): SelectQueryBuilder<T> {
    let qb = this.createQueryBuilder('entity');
    qb = this.addEagerRelations(qb);

    // === VALORES PADRÃO ===
    let limit = 10;
    let page = 1;
    let actualFilter: Filter | undefined = undefined;

    // === SE FOR FilterDto: extrai filter, page, limit ===
    if (filter instanceof FilterDto) {
      actualFilter = filter.filter;
      limit = filter.limit ?? 10;
      page = filter.page > 0 ? filter.page : 1; // garante página mínima 1
    }
    // === SE FOR Filter direto ===
    else if (filter) {
      actualFilter = filter;
    }

    // === APLICA FILTRO (se existir) ===
    if (actualFilter) {
      qb = applyFilters(qb, this.target, 'entity', actualFilter);
    }

    // === APLICA PAGINAÇÃO ===
    const skip = (page - 1) * limit;
    qb = qb.take(limit).skip(skip);

    return qb;
  }

  private addEagerRelations(qb: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    const metadata = this.manager.connection.getMetadata(this.target);
    metadata.relations
      .filter((relation) => relation.isEager)
      .forEach((relation) => {
        qb.leftJoinAndSelect(`entity.${relation.propertyName}`, relation.propertyName);
      });
    return qb;
  }
}