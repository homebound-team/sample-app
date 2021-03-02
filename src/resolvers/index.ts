import { Resolvers } from "src/generated/graphql-types";
import { enumResolvers } from "src/resolvers/enumResolvers";
import { mutationResolvers } from "src/resolvers/mutations";
import { objectResolvers } from "src/resolvers/objects";
import { queryResolvers } from "src/resolvers/queries";
import { scalarResolvers } from "src/resolvers/scalarResolvers";

export const resolvers: Resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  ...objectResolvers,
  ...enumResolvers,
  ...scalarResolvers,
};
