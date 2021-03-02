import "src/setupDbTests";
import { nullIfEmpty } from "./utils";

describe("nullIfEmpty", () => {
  it("works", () => {
    expect(nullIfEmpty("")).toEqual(null);
    expect(nullIfEmpty(" ")).toEqual(" ");
  });
});

/*
describe("saveEntities", () => {
  it.withCtx("can create multiple entities", async (ctx) => {
    const { em } = ctx;
    // Given an input with 2 authors
    const input = [{ firstName: "A1" }, { firstName: "A2" }];

    // When I attempt to save them
    const savedEntityIds = await saveEntities(ctx, Author, input);

    // Then I expect 2 authors to be created
    expect(savedEntityIds).toHaveLength(2);
    // And that they will have the correct firstNames
    const [a1, a2] = await em.loadAll(Author, savedEntityIds);
    expect(a1.firstName).toEqual("A1");
    expect(a2.firstName).toEqual("A2");
  });

  it.withCtx("can create and update entities", async (ctx) => {
    const { em } = ctx;
    // Given an input with 2 authors where 1 exists
    const existing = newAuthor(em, { firstName: "ExistingName" });
    await em.flush();
    const input = [{ id: existing.idOrFail, firstName: "A1" }, { firstName: "A2" }];

    // When I attempt to save them
    const savedEntityIds = await saveEntities(ctx, Author, input);

    // Then I expect 2 authors to be returned
    expect(savedEntityIds).toHaveLength(2);
    // And that they will have the correct firstNames
    const [a1, a2] = await em.loadAll(Author, savedEntityIds);
    expect(a1.firstName).toEqual("A1");
    expect(a2.firstName).toEqual("A2");
    // And that a1 will have the same ID as the existing author (it was updated)
    expect(a1.idOrFail).toEqual(existing.idOrFail);
  });
});
 */
