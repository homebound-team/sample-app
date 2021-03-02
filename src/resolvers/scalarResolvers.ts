import { GraphQLDate, GraphQLDateTime } from "graphql-scalars";
import { Resolvers } from "src/generated/graphql-types";

export const scalarResolvers: Pick<Resolvers, "Date" | "DateTime"> = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
};
