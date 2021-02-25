import { authorResolvers } from "src/resolvers/objects/author/authorResolvers";
import { bookResolvers } from "src/resolvers/objects/book/bookResolvers";
import { bookAdvanceResolvers } from "src/resolvers/objects/bookAdvance/bookAdvanceResolvers";
import { bookReviewResolvers } from "src/resolvers/objects/bookReview/bookReviewResolvers";
import { imageResolvers } from "src/resolvers/objects/image/imageResolvers";
import { publisherResolvers } from "src/resolvers/objects/publisher/publisherResolvers";
import { tagResolvers } from "src/resolvers/objects/tag/tagResolvers";

// This file is auto-generated

export const objectResolvers = {
  Author: authorResolvers,
  Book: bookResolvers,
  BookAdvance: bookAdvanceResolvers,
  BookReview: bookReviewResolvers,
  Image: imageResolvers,
  Publisher: publisherResolvers,
  Tag: tagResolvers,
};
