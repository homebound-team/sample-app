import { Context } from "src/context";
import { run } from "src/resolvers/testUtils";
import { testQuery } from "src/resolvers/queries/testQueryResolver";

describe("testQuery", () => {
  it("returns 10", async () => {
    const r = await runTestQuery({}, () => ({}));
    expect(r).toEqual(10);
  });
});

async function runTestQuery(ctx: Context, argsFn: () => {}) {
  return await run(ctx, async () => {
    return testQuery.testQuery({}, argsFn(), ctx, undefined!);
  });
}
