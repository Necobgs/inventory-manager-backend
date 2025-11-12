import { isObject } from '../../utils/is-object';
import { EntityTarget, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export type LogicalOperator = '$or' | '$and' | '$not';

export type Operator =
  | '$eq'
  | '$ne'
  | '$gt'
  | '$gte'
  | '$lt'
  | '$lte'
  | '$in'
  | '$nin'
  | '$like'
  | '$ilike'
  | '$null'
  | '$between'
  | '$contains'
  | '$contained'
  | '$overlap'
  | '$startsWith'
  | '$endsWith';

type Primitive = string | number | boolean | null;

export type Condition = {
  [field: string]: { [key in Operator]?: Primitive | Primitive[] } | Primitive;
};

export interface LogicalFilter {
  $or?: Filter[];
  $and?: Filter[];
  $not?: Filter;
}

export type Filter = string | Condition | LogicalFilter;

export interface Item {
  [key: string]: any;
}

// === CONJUNTO DE OPERADORES VÁLIDOS ===
const VALID_OPERATORS = new Set<Operator>([
  '$eq', '$ne', '$gt', '$gte', '$lt', '$lte',
  '$in', '$nin', '$like', '$ilike', '$null',
  '$between', '$contains', '$contained', '$overlap',
  '$startsWith', '$endsWith'
]);

const LOGICAL_OPERATORS = new Set<LogicalOperator>(['$or', '$and', '$not']);

/**
 * Aplica filtros ao QueryBuilder do TypeORM de forma segura e robusta.
 */
export function applyFilters<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  target: EntityTarget<T>,
  alias: string = 'entity',
  filter: Filter,
): SelectQueryBuilder<T> {
  const parsed = parseFilter(filter);
  if (!parsed || !isObject(parsed)) return qb;

  // Log opcional para debug
  // console.log('[applyFilters] Filtro processado:', JSON.stringify(parsed, null, 2));

  Object.entries(parsed).forEach(([key, value]) => {
    if (LOGICAL_OPERATORS.has(key as LogicalOperator)) {
      applyLogicalOperator(qb, target, alias, key as LogicalOperator, value);
    } else {
      applyFieldCondition(qb, target, alias, key, value);
    }
  });

  return qb;
}

/**
 * Trata operadores lógicos: $or, $and, $not
 */
function applyLogicalOperator<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  target: EntityTarget<T>,
  alias: string,
  operator: LogicalOperator,
  value: any,
): void {
  if (!Array.isArray(value) && operator !== '$not') {
    return;
  }

  const conditions = operator === '$not'
    ? [value]
    : value as Filter[];

  const subQueries = conditions
    .filter(Boolean)
    .map(subFilter => {
      const subQb = qb.connection
        .createQueryBuilder(target, `${alias}_sub`)
        .select(`${alias}_sub.id`);
      applyFilters(subQb, target, `${alias}_sub`, subFilter);
      return `(${subQb.getQuery()})`;
    });

  if (subQueries.length === 0) return;

  const joined = subQueries.join(` ${operator === '$or' ? 'OR' : 'AND'} `);
  const finalCondition = operator === '$not'
    ? `NOT (${joined})`
    : `(${joined})`;

  qb.andWhere(finalCondition);
}

/**
 * Aplica condição em um campo (simples ou relacional)
 */
function applyFieldCondition<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  target: EntityTarget<T>,
  alias: string,
  path: string,
  value: any,
): void {
  const normalized = normalizeConditionValue(value);
  if (!normalized || typeof normalized !== 'object') return;

  if (path.includes('.')) {
    applyRelationCondition(qb, target, alias, path, normalized);
  } else {
    applySimpleCondition(qb, alias, path, normalized);
  }
}

/**
 * Normaliza valor: primitivo → { $eq: value }, objeto com $ → mantém
 */
function normalizeConditionValue(value: any): any {
  if (value === null) return { $null: true };

  if (typeof value !== 'object' || Array.isArray(value)) {
    return { $eq: value };
  }

  const keys = Object.keys(value);
  if (keys.length === 0) return { $eq: null };

  // Se já tem operador válido
  if (keys.some(k => VALID_OPERATORS.has(k as Operator))) {
    return value;
  }

  // Caso contrário, assume valor direto
  return { $eq: value };
}

/**
 * Condição em campo simples (não relacional)
 */
function applySimpleCondition<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  field: string,
  condition: any,
): void {
  Object.entries(condition).forEach(([op, val]) => {
    if (!VALID_OPERATORS.has(op as Operator)) {
      throw new Error(`Operador inválido: ${op}`);
    }
    evaluateOperator(qb, `${alias}.${field}`, op as Operator, val);
  });
}

/**
 * Condição em relação (user.profile.name)
 */
function applyRelationCondition<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  target: EntityTarget<T>,
  alias: string,
  path: string,
  condition: any,
): void {
  const [relation, field] = path.split('.');
  const metadata = qb.connection.getMetadata(target);
  const relationMeta = metadata.findRelationWithPropertyPath(relation);

  if (!relationMeta) {
    throw new Error(`Relação não encontrada: ${relation}`);
  }

  const relationAlias = `${alias}_${relation}`;

  Object.entries(condition).forEach(([op, val]) => {
    if (!VALID_OPERATORS.has(op as Operator)) {
      throw new Error(`Operador inválido: ${op}`);
    }

    if (relationMeta.isManyToOne || relationMeta.isOneToOne) {
      qb.leftJoin(`${alias}.${relation}`, relationAlias);
      const path = `"${relationAlias}"."${field}"`;
      const { condition: cond, params } = generateSqlCondition(field, path, op as Operator, val);
      qb.andWhere(cond, params);
    } else {
      // Many-to-Many
      handleManyToManyCondition(qb, target, alias, relation, relationAlias, field, op as Operator, val);
    }
  });
}

function handleManyToManyCondition<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  target: EntityTarget<T>,
  alias: string,
  relation: string,
  relationAlias: string,
  field: string,
  operator: Operator,
  value: any,
): void {
  const metadata = qb.connection.getMetadata(target);
  const rel = metadata.findRelationWithPropertyPath(relation)!;
  const joinTable = rel.joinTableName || `${metadata.tableName}_${rel.propertyName}`;
  const joinCol = rel.joinColumns[0].databaseName;
  const invJoinCol = rel.inverseJoinColumns[0].databaseName;
  const invTable = rel.inverseEntityMetadata.tableName;

  const path = `"${relationAlias}_inv"."${field}"`;
  const { condition, params } = generateSqlCondition(field, path, operator, value);

  const subQuery = `
    SELECT "${alias}_main"."id"
    FROM "${metadata.givenTableName}" "${alias}_main"
    INNER JOIN "${joinTable}" "${relationAlias}_join"
      ON "${relationAlias}_join"."${joinCol}" = "${alias}_main"."id"
    INNER JOIN "${invTable}" "${relationAlias}_inv"
      ON "${relationAlias}_inv"."id" = "${relationAlias}_join"."${invJoinCol}"
    WHERE ${condition}
  `;

  qb.andWhere(`"${alias}"."id" IN (${subQuery})`, params);
}

/**
 * Gera SQL + parâmetros para operador
 */
function generateSqlCondition(
  field: string,
  path: string,
  operator: Operator,
  value: any,
): { condition: string; params: Record<string, any> } {
  const param = (name: string, val: any) => ({ [name]: val });

  switch (operator) {
    case '$eq': return { condition: `${path} = :${field}`, params: param(field, value) };
    case '$ne': return { condition: `${path} != :${field}`, params: param(field, value) };
    case '$gt': return { condition: `${path} > :${field}`, params: param(field, value) };
    case '$gte': return { condition: `${path} >= :${field}`, params: param(field, value) };
    case '$lt': return { condition: `${path} < :${field}`, params: param(field, value) };
    case '$lte': return { condition: `${path} <= :${field}`, params: param(field, value) };

    case '$in':
      if (!Array.isArray(value)) throw new Error('$in requer array');
      return { condition: `${path} IN (:...${field})`, params: param(field, value) };

    case '$nin':
      if (!Array.isArray(value)) throw new Error('$nin requer array');
      return { condition: `${path} NOT IN (:...${field})`, params: param(field, value) };

    case '$like': return { condition: `${path} LIKE :${field}`, params: param(field, value) };
    case '$ilike': return { condition: `${path} ILIKE :${field}`, params: param(field, value) };

    case '$null':
      return value === true
        ? { condition: `${path} IS NULL`, params: {} }
        : { condition: `${path} IS NOT NULL`, params: {} };

    case '$between':
      if (!Array.isArray(value) || value.length !== 2) throw new Error('$between requer [min, max]');
      return { condition: `${path} BETWEEN :${field}_start AND :${field}_end`, params: {
        [`${field}_start`]: value[0],
        [`${field}_end`]: value[1],
      }};

    case '$contains': return { condition: `${path} @> :${field}`, params: param(field, value) };
    case '$contained': return { condition: `${path} <@ :${field}`, params: param(field, value) };
    case '$overlap': return { condition: `${path} && :${field}`, params: param(field, value) };

    case '$startsWith':
      return { condition: `${path} LIKE :${field}`, params: param(field, `${value}%`) };

    case '$endsWith':
      return { condition: `${path} LIKE :${field}`, params: param(field, `%${value}`) };

    default:
      throw new Error(`Operador não suportado: ${operator}`);
  }
}

/**
 * Avalia operador e aplica `andWhere`
 */
function evaluateOperator<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  path: string,
  operator: Operator,
  value: any,
): void {
  const { condition, params } = generateSqlCondition(path.split('.').pop()!, path, operator, value);
  qb.andWhere(condition, params);
}

/**
 * Parse seguro de string JSON → objeto
 */
function parseFilter(filter: Filter): Filter | null {
  if (!filter) return null;
  if (typeof filter === 'string') {
    try {
      return JSON.parse(filter);
    } catch (err) {
      console.warn('[applyFilters] JSON inválido:', filter);
      return null;
    }
  }
  return filter;
}