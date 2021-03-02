import { BaseEntity, DeepPartialOrNull, EntityConstructor, IdOf } from "joist-orm";
import { Context } from "src/context";
import { idsOf } from "src/utils";

export function nullIfEmpty(input: string | null | undefined): any {
  if (input === "") {
    return null;
  }
  return input ?? null;
}

/* A helper for the standard bulk save entity resolver */
export async function saveEntities<T extends BaseEntity>(
  ctx: Context,
  type: EntityConstructor<T>,
  input: DeepPartialOrNull<T>[],
): Promise<IdOf<T>[]> {
  const { em } = ctx;
  // logger.info({ input }, `Creating/updating ${input.length} ${type.name} entities`);
  const entities = await Promise.all(input.map((input) => em.createOrUpdatePartial(type, input)));
  await em.flush();
  return idsOf(entities);
}
