import { ConnectionConfig } from "pg";
import { newConfig, string } from "ts-app-env";

const stages = ["local", "test", "dev", "prod"] as const;

// We assume our env variables have already been set at this point.
// If they are missing, then we need to fail immediately.
if (process.env.STAGE === undefined || !stages.includes(process.env.STAGE as any)) {
  throw new Error(`Unknown STAGE: ${process.env.STAGE}`);
}

export class Stage {
  constructor(public value: typeof stages[number]) {}
  get isLocal(): boolean {
    return this.value === "local";
  }
  get isTest(): boolean {
    return this.value === "test";
  }
  get isDev(): boolean {
    return this.value === "dev";
  }
  get isProd(): boolean {
    return this.value === "prod";
  }
  toString() {
    return this.value;
  }
}

export const stage = new Stage(process.env.STAGE as typeof stages[number]);

const AppEnv = {
  STAGE: string(),
  DB_DATABASE: string(),
  DB_USER: string(),
  DB_PASSWORD: string(),
  DB_HOST: string(),
  DB_PORT: string(),
};

export type EnvironmentVariables = keyof typeof AppEnv;

// Validates all of the env variables are available.
export const env = newConfig(AppEnv, process.env, { ignoreErrors: stage.isLocal || stage.isTest || stage.isDev });

export type Environment = typeof AppEnv;
export type EnvironmentOverrides = Omit<Partial<Environment>, "STAGE">;

export function newPgConnectionConfig(overrides: EnvironmentOverrides = {}): ConnectionConfig {
  const envWithOverrides = { ...env, ...overrides };
  return Object.fromEntries(
    ["database", "user", "password", "host", "port"].map((key) => [
      key,
      envWithOverrides[`DB_${key.toUpperCase()}` as EnvironmentVariables],
    ]),
  );
}
