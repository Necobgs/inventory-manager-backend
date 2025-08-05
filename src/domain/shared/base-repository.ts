import {
  DataSource,
  EntityTarget,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { applyFilters, Filter } from './apply-filters';
import {FilterDto } from './filter-dto'

export abstract class BaseRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
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

  async filterAll(filter?: FilterDto): Promise<T[]> {
    return this.getFilteredQueryBuilder(filter).getMany();
  }

  private getFilteredQueryBuilder(filter?: FilterDto | Filter): SelectQueryBuilder<T> {
    let qb = this.manager.createQueryBuilder(this.target, 'entity');
    let limit = 10
    let page = 1 - 1
    let skip = limit * page
    qb = this.addEagerRelations(qb);
    if (filter){
      qb = applyFilters(qb, this.target, 'entity',filter instanceof FilterDto ? filter.filter : filter);
      if(filter instanceof FilterDto){
        limit = filter.limit ?? 10
        page = filter.page > 0 ? filter.page - 1 : filter.page
        skip = limit * page
      }
    }
    qb = qb.take(limit).skip(skip)
    return qb;
  }

  private addEagerRelations(qb: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    const metadata = this.manager.connection.getMetadata(this.target);
    metadata.relations
      .filter((relation) => relation.isEager)
      .forEach((relation) => {
        qb.leftJoinAndSelect(
          `entity.${relation.propertyName}`,
          relation.propertyName,
        );
      });
    return qb;
  }
}