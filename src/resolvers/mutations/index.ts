import { MutationResolvers } from "src/generated/graphql-types";
import { saveAuthor } from "src/resolvers/mutations/author/saveAuthorResolver";
import { saveBook } from "src/resolvers/mutations/book/saveBookResolver";
import { saveBookAdvance } from "src/resolvers/mutations/bookAdvance/saveBookAdvanceResolver";
import { saveBookReview } from "src/resolvers/mutations/bookReview/saveBookReviewResolver";
import { saveImage } from "src/resolvers/mutations/image/saveImageResolver";
import { savePublisher } from "src/resolvers/mutations/publisher/savePublisherResolver";
import { saveTag } from "src/resolvers/mutations/tag/saveTagResolver";

// This file is auto-generated

export const mutationResolvers: MutationResolvers = {
  ...saveAuthor,
  ...saveBook,
  ...saveBookAdvance,
  ...saveBookReview,
  ...saveImage,
  ...savePublisher,
  ...saveTag,
};
