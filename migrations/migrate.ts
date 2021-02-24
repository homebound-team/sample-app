import pgStructure, { Db } from "@homebound/pg-structure";
import { AsyncLocalStorage } from "async_hooks";
import { isEntityTable, isJoinTable } from "joist-migration-utils";
import pgMigrate from "node-pg-migrate";
import { Client, ClientConfig } from "pg";
import { env, EnvironmentOverrides, newPgConnectionConfig, stage } from "src/env";

const productionDirectory = "/home/node/app/migrations";
const migrationContext = new AsyncLocalStorage<{ client: Client; config: ClientConfig }>();

/** Allows migrations to get a pg-structure snapshot of the schema for doing dynamic behavior. */
export async function newPgStructure(options: Parameters<typeof pgStructure>[1] = {}): Promise<Db> {
  const client = migrationContext.getStore()?.client!;
  return await pgStructure(client, options);
}

export async function runMigrationsIfNeeded(
  opts: { overrides?: EnvironmentOverrides; dir?: string } = {},
): Promise<void> {
  const { dir = productionDirectory, overrides = {} } = opts;
  const config = newPgConnectionConfig(overrides);
  console.log("config", config);
  const client = new Client(config);
  await client.connect();
  return new Promise((resolve, reject) => {
    migrationContext.run({ client, config }, async () => {
      try {
        await pgMigrate({
          dbClient: client,
          migrationsTable: "migrations",
          dir,
          count: (undefined as any) as number,
          direction: "up",
          ignorePattern: "(\\..*)|(.*\\.d\\.ts)|(.*utils\\.[jt]s)|(migrate\\.[jt]s)|(migrate\\.test\\.[jt]s)",
          decamelize: true,
        });

        if (stage.isLocal || stage.isTest) {
          console.log("Creating flush_database() function");
          await createFlushDbFunction(await newPgStructure(), client);
        }

        resolve();
      } catch (e) {
        reject(e);
      } finally {
        await client.end();
      }
    });
  });
}

/** Creates a `flush_database` stored procedure to truncate all of the tables between tests. */
async function createFlushDbFunction(db: Db, client: Client): Promise<void> {
  await client.query(generateFlushFunction(db));
}

function generateFlushFunction(db: Db): string {
  // Note DELETEs+ALTER SEQUENCE is actually faster than TRUNCATEs (10s of ms vs. 100s of ms w/40 tables)
  const statements = db.tables
    .filter((t) => isEntityTable(t) || isJoinTable(t))
    .filter((t) => t.name !== "users")
    .map((t) => t.name)
    .map((t) => `DELETE FROM "${t}"; ALTER SEQUENCE "${t}_id_seq" RESTART WITH 1 INCREMENT BY 1;`);
  return `CREATE OR REPLACE FUNCTION flush_database() RETURNS void AS $$
    BEGIN
    ${statements.join("\n")}
    END;
   $$ LANGUAGE
    'plpgsql'`;
}

/** Returns names of the N local databases we use for test parallelization. */
async function collectAllTestDatabases() {
  const config = newPgConnectionConfig();
  const client = new Client(config);
  await client.connect();
  const res = await client.query(
    "SELECT datname FROM pg_database WHERE datistemplate = false AND datname LIKE 'homebound_tests_%'",
  );
  await client.end();
  return res.rows.map((r) => r.datname);
}

async function runMigrationsLocally() {
  const databases = stage.isTest ? await collectAllTestDatabases() : [env.DB_DATABASE];
  const migrationsRuns = databases.map((database) =>
    runMigrationsIfNeeded({ dir: "./migrations", overrides: { DB_DATABASE: database } }),
  );
  try {
    await Promise.all(migrationsRuns);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigrationsLocally();
}
