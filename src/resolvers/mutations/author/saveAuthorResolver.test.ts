import { Author } from "src/entities";
import { Context } from "src/context";
import { SaveAuthorInput } from "src/generated/graphql-types";
import { run } from "src/resolvers/testUtils";
import { saveAuthor } from "src/resolvers/mutations/author/saveAuthorResolver";

import "src/setupDbTests";

describe("saveAuthor", () => {
  it.withCtx("can create", async (ctx) => {
    const { em } = ctx;
    const result = await runSaveAuthor(ctx, () => ({}));
    const a = await em.load(Author, result.author);
  });
});

async function runSaveAuthor(ctx: Context, inputFn: () => SaveAuthorInput) {
  return await run(ctx, async (ctx) => {
    return saveAuthor.saveAuthor({}, { input: inputFn() }, ctx, undefined!);
  });
}
