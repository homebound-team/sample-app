import { addResolversToSchema } from "@graphql-tools/schema";
import Fastify, { FastifyInstance } from "fastify";
import { GraphQLSchema } from "graphql";
import Mercurius from "mercurius";
import { resolvers } from "src/resolvers";
import { loadGqlSchema } from "src/schema";

/**
 * Creates the fastify/GraphQL app with the given `context` dependencies.
 *
 * We accept `context` as a parameter b/c the caller will be responsible for shutting it down
 * when the application is closed, i.e. there isn't a great way to observe "app is shutting down"
 * from within the fastify/GraphQL APIs.
 */
export async function createApp(context: any): Promise<FastifyInstance> {
  const app = Fastify();

  void app.register(Mercurius, {
    schema: await createExecutableSchema(),
    graphiql: "playground",
    playgroundSettings: { "request.credentials": "include" } as any,
    // context: (req) => createRequestContext(context, req),
    jit: 1,
  });

  app.get("/health", (req, res) => {
    void res.send("Good");
  });

  return app;
}

export async function createExecutableSchema(): Promise<GraphQLSchema> {
  return addResolversToSchema({
    schema: await loadGqlSchema(),
    resolvers: { ...(resolvers as any) },
    resolverValidationOptions: {
      // Our entity resolvers liberally map the backend types to functions that
      // might not be exposed in the GraphQL schema yet, which is fine.
      allowResolversNotInSchema: true,
    },
  });
}

// start the app when this file is run directly
if (require.main === module) {
  (async (): Promise<void> => {
    // await runMigrationsIfNeeded();
    // const context = await newAppContextForStage();
    const app = await createApp(null);
    app.listen({ port: 4000 }, () => {
      console.log(`🚀 Server ready at http://localhost:4000/playground`);
    });
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
