import { Resolvers } from "src/generated/graphql-types";
import { objectResolvers } from "src/resolvers/objects";
import { queryResolvers } from "src/resolvers/queries";

export const resolvers: Resolvers = {
  Query: queryResolvers,
  ...objectResolvers,
};
