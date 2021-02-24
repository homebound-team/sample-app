import { Context } from "src/context";
import { GraphQLResolveInfo } from "graphql";

export interface Resolvers {
  Query: QueryResolvers;
}

export interface QueryResolvers {
  testQuery: Resolver<{}, {}, number>;
}

export type Resolver<R, A, T> = (root: R, args: A, ctx: Context, info: GraphQLResolveInfo) => T | Promise<T>;

export type SubscriptionResolverFilter<R, A, T> = (
  root: R | undefined,
  args: A,
  ctx: Context,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;
export type SubscriptionResolver<R, A, T> = {
  subscribe: (root: R | undefined, args: A, ctx: Context, info: GraphQLResolveInfo) => AsyncIterator<T>;
};

export const possibleTypes = {} as const;
