import { Entity, isEntity } from "joist-orm";
import { Context } from "src/context";
import { Resolver } from "src/generated/graphql-types";

/** Runs the `fn` in a dedicated / non-test Unit of Work. */
export async function run<T>(ctx: Context, fn: (ctx: Context) => Promise<T>): Promise<T> {
  // const { em } = ctx;
  // Ensure any test data we've setup is flushed
  // await em.flush();
  // Give the code under test a new EntityManager
  const newCtx = { ...ctx };
  const result = await fn(newCtx);
  // We expect `fn` (i.e. a resolver) to do it's own UoW management, so don't flush.
  // await em.refresh();
  return result;
}

// Returns the keys of resolver T that only take no arguments.
type NoArgKeys<T> = keyof {
  [K in keyof T]: T[K] extends Resolver<any, {}, any> ? T[K] : never;
};

// For a type-union of keys `KS`, return what each key is in the resolver `T`.
type ResolverResult<T, KS> = {
  [K1 in keyof KS]: K1 extends keyof T ? T[K1] : never;
};

type ResolverArg<T, K extends keyof T> = T[K] extends Resolver<any, infer A, any> ? A : never;

// The return type of `makeRunResolver`
type RunResolverMethod<T, R> = <K extends keyof T>(
  ctx: Context,
  // Support a lambda to post-flush eval the root, or pass the entity directly (and we'll post-flush get the id)
  root: (() => R) | (R extends string ? Entity : never),
  key: K,
  // Support either the resolver arg directly or a lambda to create the args post-flush
  args: ResolverArg<T, K> | (() => ResolverArg<T, K>),
) => Promise<T[K] extends (...args: any[]) => any ? ReturnType<T[K]> : never>;

/** Creates a `runResolver` method to invoke a specific resolver key with that key's args. */
export function makeRunResolver<T, R>(resolver: T): RunResolverMethod<T, R> {
  return async (ctx, root, key, args) => {
    return await run(ctx, async (ctx) => {
      return (resolver[key] as any)(
        isEntity(root) ? root.idOrFail : root(),
        args instanceof Function ? args() : args,
        ctx,
        undefined!,
      );
    });
  };
}

// The return type for makeRunResolverKeys
type RunKeysResolverMethod<T, R> = <K extends Array<NoArgKeys<T>>>(
  ctx: Context,
  root: (R extends string ? Entity : never) | (() => R),
  keys: K,
) => Promise<any>; // TODO Put `ResolverResult<T, K>>` back and fix it

/** Creates a `runResolverKeys` method that can invoke multiple keys against a resolver. */
export function makeRunResolverKeys<T, R>(resolver: T): RunKeysResolverMethod<T, R> {
  return async (ctx: Context, root: (R extends string ? Entity : never) | (() => R), keys) => {
    return await run(ctx, async (ctx) => {
      // Build a result with each key, where keys might return a promise, so we `await` to make assertions easier
      return Object.fromEntries(
        await Promise.all(
          keys.map(async (key) => {
            return [key, await (resolver[key] as any)(isEntity(root) ? root.idOrFail : root(), {}, ctx, undefined!)];
          }),
        ),
      );
    });
  };
}
