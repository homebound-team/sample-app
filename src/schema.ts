import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { GraphQLSchema } from "graphql";

// These should never change during a run, so cache the promise.
let promise: Promise<GraphQLSchema> | undefined;

/** Loads our GraphQL schema from the `*.graphql` files. */
export async function loadGqlSchema(): Promise<GraphQLSchema> {
  return (promise ??= loadSchema("./schema/**/*.graphql", { loaders: [new GraphQLFileLoader()] }));
}
