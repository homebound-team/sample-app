import { Author } from "src/entities";
import { authorResolvers } from "src/resolvers/objects/author/authorResolvers";
import "src/setupDbTests";

describe("entityResolver", () => {
  // it.withCtx("can access getters", async (ctx) => {
  //   const { em } = ctx;
  //   em.create(Author, { firstName: "a1", lastName: "l1" });
  //   await em.flush();
  //   const fullName = await authorResolvers.fullName("1", {}, ctx, undefined!);
  //   expect(fullName).toEqual("a1 l1");
  // });
  //
  // it.withCtx("can access async methods", async (ctx) => {
  //   const { em } = ctx;
  //   em.create(Author, { firstName: "a1", lastName: "l1" });
  //   await em.flush();
  //   const numberOfPosts = await authorResolvers.numberOfPosts("1", {}, ctx, undefined!);
  //   expect(numberOfPosts).toEqual(0);
  // });
});
