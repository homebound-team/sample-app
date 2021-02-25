import {
  BaseEntity,
  Collection,
  Entity,
  EntityMetadata,
  Field,
  getProperties,
  ManyToManyField,
  ManyToOneField,
  ManyToOneReference,
  OneToManyField,
  OneToOneField,
  Reference,
} from "joist-orm";
import { AbstractRelationImpl } from "joist-orm/build/collections/AbstractRelationImpl";
import { Context } from "src/context";

type GraphQLPrimitive = string | Date | boolean | number | null | undefined;

type IdFlavorOf<T extends Entity> = T extends { id: infer U } ? Exclude<U, undefined> : never;

/**
 * Maps properties like `Entity.firstName: string` to field resolver functions like `firstName(): Promise<string>`.
 *
 * Note that we don't necessarily know/care if `firstName` is in the `Entity` GraphQL type, we just map
 * every field to a potential resolver, and then will let the `EntityResolvers` type-check effectively
 * do the union of "what's defined on the ORM type vs. what's defined on the GraphQL type".
 */
type EntityFieldResolvers<T extends Entity> = {
  [P in keyof T]: T[P] extends GraphQLPrimitive
    ? () => Promise<T[P]>
    : T[P] extends Collection<T, infer U>
    ? (root: IdFlavorOf<T>, args: {}, ctx: Context) => Promise<IdFlavorOf<U>[]>
    : T[P] extends Reference<T, infer U, infer N>
    ? (root: IdFlavorOf<T>, args: {}, ctx: Context) => Promise<IdFlavorOf<U>>
    : T[P];
};

/** Maps an entity type `T` to the field resolvers we can provide for free. */
type EntityResolver<T extends Entity> = EntityFieldResolvers<Exclude<T, "id">> & {
  id(): string;
};

export interface EntityResolverOptions<T extends Entity, G> {
  gqlName?: string;
  mappedFields?: { [P in keyof Omit<T, "toString">]?: keyof G };
}

/**
 * Creates field resolvers for each of the fields on our entity.
 */
export function entityResolver<T extends Entity>(entityMetadata: EntityMetadata<T>): EntityResolver<T> {
  const primitiveResolvers = entityMetadata.fields
    .filter((ormField) => !isReference(ormField) && !isCollection(ormField))
    .map((ormField) => {
      // We can resolve the id directly against itself.
      if (ormField.fieldName === "id") {
        return ["id", (id: string) => id];
      }
      // Otherwise, we need to N+1-safely load the id, and access the property that way.
      // Currently, we only support primitives, i.e. strings/numbers/etc. and not collections.
      return [
        ormField.fieldName,
        async (id: string, args: unknown, ctx: Context) => {
          const entity = await ctx.em.load(entityMetadata.cstr, id);
          return (entity as any)[ormField.fieldName];
        },
      ];
    });

  const referenceResolvers = entityMetadata.fields
    .filter((ormField) => isReference(ormField))
    .map((ormField) => {
      return [
        ormField.fieldName,
        async (id: string, _args: unknown, ctx: Context) => {
          // OneToOneReferences do not have the id of referenced entity (since the foreign key is held by the "other
          // side"), so we need to load() before we can read the id of the referenced entity.
          const entity = isOneToOneReference(ormField)
            ? await ctx.em.load(entityMetadata.cstr, id, { [ormField.fieldName]: [] } as any)
            : await ctx.em.load(entityMetadata.cstr, id);
          return (entity as any)[ormField.fieldName].id;
        },
      ];
    });

  const collectionResolvers = entityMetadata.fields
    .filter((ormField) => isCollection(ormField))
    .map((ormField) => {
      return [
        ormField.fieldName,
        async (id: string, args: unknown, ctx: Context) => {
          const entity = await ctx.em.load(entityMetadata.cstr, id);
          const others = await (entity as any)[ormField.fieldName].load();
          return others.map((other: any) => other.idOrFail);
        },
      ];
    });

  const resolvers = Object.fromEntries([...primitiveResolvers, ...referenceResolvers, ...collectionResolvers]);

  // Look for non-orm properties on the domain object's prototype
  // and on an instance of the domain object itself to get
  // non-prototype properties like CustomReferences
  const ignoredKeys = Object.keys(resolvers);
  const customProperties = getProperties(entityMetadata).filter((n) => !ignoredKeys.includes(n));
  const customResolvers = customProperties.map((key) => {
    return [
      key,
      async (id: string, _args: unknown, ctx: Context) => {
        const entity = await ctx.em.load(entityMetadata.cstr, id);
        const property = (entity as any)[key];

        let resultOrPromise: any;
        if (typeof property === "function") {
          resultOrPromise = (property as Function).apply(entity);
        } else if (property instanceof ManyToOneReference) {
          resultOrPromise = property.idOrFail;
        } else if (property instanceof AbstractRelationImpl) {
          resultOrPromise = (property as any).load();
        } else {
          resultOrPromise = property;
        }

        const result = resultOrPromise instanceof Promise ? await resultOrPromise : resultOrPromise;
        if (Array.isArray(result)) {
          return result.map((v) => (v instanceof BaseEntity ? v.idOrFail : v));
        } else if (result instanceof BaseEntity) {
          return result.idOrFail;
        } else {
          return result;
        }
      },
    ];
  });

  return {
    ...resolvers,
    ...Object.fromEntries(customResolvers),
  } as any;
}

function isReference(ormField: Field): ormField is ManyToOneField | OneToOneField {
  return ormField.kind === "m2o" || ormField.kind === "o2o";
}

function isOneToOneReference(ormField: Field): ormField is OneToOneField {
  return ormField.kind === "o2o";
}

function isCollection(ormField: Field): ormField is OneToManyField | ManyToManyField {
  return ormField.kind === "o2m" || ormField.kind === "m2m";
}
