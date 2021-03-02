/** App-level dependencies like connection pools/etc. */
import { EntityManager } from "src/entities";

export interface AppContext {}

/** Request-level dependencies. */
export interface Context extends AppContext {
  em: EntityManager;
}

export async function newAppContextForStage(): Promise<AppContext> {
  return newAppContext();
}

/** Creates a production AppContext against our production slack, sendgrid, etc. vendors. */
async function newAppContext(): Promise<AppContext> {
  return {};
}
