import { Entity, IdOf } from "joist-orm";

const _idsOf = <T extends Entity>(entities: readonly T[]) => entities.map((e) => e.idOrFail as IdOf<T>);
export function idsOf<T extends Entity>(entities: readonly T[]): IdOf<T>[];
export async function idsOf<T extends Entity>(entityPromise: Promise<readonly T[]>): Promise<IdOf<T>[]>;
export function idsOf<T extends Entity>(
  entitiesOrPromise: Promise<readonly T[]> | readonly T[],
): Promise<IdOf<T>[]> | IdOf<T>[] {
  if (entitiesOrPromise instanceof Promise) {
    return entitiesOrPromise.then(_idsOf);
  } else {
    return _idsOf(entitiesOrPromise);
  }
}
