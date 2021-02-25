import { Context } from "src/context";
import { GraphQLResolveInfo, GraphQLScalarType } from "graphql";
import {
  AuthorId,
  BookId,
  BookAdvanceId,
  AdvanceStatus,
  PublisherId,
  BookReviewId,
  ImageType,
  PublisherSize,
  ImageId,
  TagId,
} from "src/entities";

export interface Resolvers {
  Author: AuthorResolvers;
  Mutation: MutationResolvers;
  Book: BookResolvers;
  BookAdvance: BookAdvanceResolvers;
  BookReview: BookReviewResolvers;
  AdvanceStatusDetail: AdvanceStatusDetailResolvers;
  ImageTypeDetail: ImageTypeDetailResolvers;
  PublisherSizeDetail: PublisherSizeDetailResolvers;
  Image: ImageResolvers;
  Publisher: PublisherResolvers;
  Query: QueryResolvers;
  Tag: TagResolvers;
  SaveAuthorResult?: SaveAuthorResultResolvers;
  SaveBookResult?: SaveBookResultResolvers;
  SaveBookAdvanceResult?: SaveBookAdvanceResultResolvers;
  SaveBookReviewResult?: SaveBookReviewResultResolvers;
  SaveImageResult?: SaveImageResultResolvers;
  SavePublisherResult?: SavePublisherResultResolvers;
  SaveTagResult?: SaveTagResultResolvers;
  Date: GraphQLScalarType;
  DateTime: GraphQLScalarType;
}

export interface AuthorResolvers {
  id: Resolver<AuthorId, {}, string>;
  firstName: Resolver<AuthorId, {}, string>;
  lastName: Resolver<AuthorId, {}, string | null | undefined>;
  initials: Resolver<AuthorId, {}, string>;
  numberOfBooks: Resolver<AuthorId, {}, number>;
  isPopular: Resolver<AuthorId, {}, boolean | null | undefined>;
  age: Resolver<AuthorId, {}, number | null | undefined>;
  graduated: Resolver<AuthorId, {}, Date | null | undefined>;
  wasEverPopular: Resolver<AuthorId, {}, boolean | null | undefined>;
  createdAt: Resolver<AuthorId, {}, Date>;
  updatedAt: Resolver<AuthorId, {}, Date>;
  mentor: Resolver<AuthorId, {}, AuthorId | null | undefined>;
  publisher: Resolver<AuthorId, {}, PublisherId | null | undefined>;
  authors: Resolver<AuthorId, {}, AuthorId[]>;
  books: Resolver<AuthorId, {}, BookId[]>;
  image: Resolver<AuthorId, {}, ImageId | null | undefined>;
}

export interface MutationResolvers {
  saveAuthor: Resolver<{}, MutationSaveAuthorArgs, SaveAuthorResult>;
  saveBook: Resolver<{}, MutationSaveBookArgs, SaveBookResult>;
  saveBookAdvance: Resolver<{}, MutationSaveBookAdvanceArgs, SaveBookAdvanceResult>;
  saveBookReview: Resolver<{}, MutationSaveBookReviewArgs, SaveBookReviewResult>;
  saveImage: Resolver<{}, MutationSaveImageArgs, SaveImageResult>;
  savePublisher: Resolver<{}, MutationSavePublisherArgs, SavePublisherResult>;
  saveTag: Resolver<{}, MutationSaveTagArgs, SaveTagResult>;
}

export interface BookResolvers {
  id: Resolver<BookId, {}, string>;
  title: Resolver<BookId, {}, string>;
  order: Resolver<BookId, {}, number | null | undefined>;
  createdAt: Resolver<BookId, {}, Date>;
  updatedAt: Resolver<BookId, {}, Date>;
  author: Resolver<BookId, {}, AuthorId>;
  advances: Resolver<BookId, {}, BookAdvanceId[]>;
  reviews: Resolver<BookId, {}, BookReviewId[]>;
  tags: Resolver<BookId, {}, TagId[]>;
  image: Resolver<BookId, {}, ImageId | null | undefined>;
}

export interface BookAdvanceResolvers {
  id: Resolver<BookAdvanceId, {}, string>;
  createdAt: Resolver<BookAdvanceId, {}, Date>;
  updatedAt: Resolver<BookAdvanceId, {}, Date>;
  status: Resolver<BookAdvanceId, {}, AdvanceStatus>;
  book: Resolver<BookAdvanceId, {}, BookId>;
  publisher: Resolver<BookAdvanceId, {}, PublisherId>;
}

export interface BookReviewResolvers {
  id: Resolver<BookReviewId, {}, string>;
  rating: Resolver<BookReviewId, {}, number>;
  isPublic: Resolver<BookReviewId, {}, boolean>;
  createdAt: Resolver<BookReviewId, {}, Date>;
  updatedAt: Resolver<BookReviewId, {}, Date>;
  book: Resolver<BookReviewId, {}, BookId>;
}

export interface AdvanceStatusDetailResolvers {
  code: Resolver<AdvanceStatus, {}, AdvanceStatus>;
  name: Resolver<AdvanceStatus, {}, string>;
}

export interface ImageTypeDetailResolvers {
  code: Resolver<ImageType, {}, ImageType>;
  name: Resolver<ImageType, {}, string>;
  sortOrder: Resolver<ImageType, {}, number>;
}

export interface PublisherSizeDetailResolvers {
  code: Resolver<PublisherSize, {}, PublisherSize>;
  name: Resolver<PublisherSize, {}, string>;
}

export interface ImageResolvers {
  id: Resolver<ImageId, {}, string>;
  fileName: Resolver<ImageId, {}, string>;
  createdAt: Resolver<ImageId, {}, Date>;
  updatedAt: Resolver<ImageId, {}, Date>;
  type: Resolver<ImageId, {}, ImageType>;
  author: Resolver<ImageId, {}, AuthorId | null | undefined>;
  book: Resolver<ImageId, {}, BookId | null | undefined>;
  publisher: Resolver<ImageId, {}, PublisherId | null | undefined>;
}

export interface PublisherResolvers {
  id: Resolver<PublisherId, {}, string>;
  name: Resolver<PublisherId, {}, string>;
  latitude: Resolver<PublisherId, {}, number | null | undefined>;
  longitude: Resolver<PublisherId, {}, number | null | undefined>;
  hugeNumber: Resolver<PublisherId, {}, number | null | undefined>;
  createdAt: Resolver<PublisherId, {}, Date>;
  updatedAt: Resolver<PublisherId, {}, Date>;
  size: Resolver<PublisherId, {}, PublisherSize | null | undefined>;
  authors: Resolver<PublisherId, {}, AuthorId[]>;
  bookAdvances: Resolver<PublisherId, {}, BookAdvanceId[]>;
  images: Resolver<PublisherId, {}, ImageId[]>;
}

export interface QueryResolvers {
  testQuery: Resolver<{}, {}, number>;
}

export interface TagResolvers {
  id: Resolver<TagId, {}, string>;
  name: Resolver<TagId, {}, string>;
  createdAt: Resolver<TagId, {}, Date>;
  updatedAt: Resolver<TagId, {}, Date>;
  books: Resolver<TagId, {}, BookId[]>;
}

export interface SaveAuthorResultResolvers {
  author: Resolver<SaveAuthorResult, {}, AuthorId>;
}

export interface SaveBookResultResolvers {
  book: Resolver<SaveBookResult, {}, BookId>;
}

export interface SaveBookAdvanceResultResolvers {
  bookAdvance: Resolver<SaveBookAdvanceResult, {}, BookAdvanceId>;
}

export interface SaveBookReviewResultResolvers {
  bookReview: Resolver<SaveBookReviewResult, {}, BookReviewId>;
}

export interface SaveImageResultResolvers {
  image: Resolver<SaveImageResult, {}, ImageId>;
}

export interface SavePublisherResultResolvers {
  publisher: Resolver<SavePublisherResult, {}, PublisherId>;
}

export interface SaveTagResultResolvers {
  tag: Resolver<SaveTagResult, {}, TagId>;
}

export type Resolver<R, A, T> = (root: R, args: A, ctx: Context, info: GraphQLResolveInfo) => T | Promise<T>;

export type SubscriptionResolverFilter<R, A, T> = (
  root: R | undefined,
  args: A,
  ctx: Context,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;
export type SubscriptionResolver<R, A, T> = {
  subscribe: (root: R | undefined, args: A, ctx: Context, info: GraphQLResolveInfo) => AsyncIterator<T>;
};

export interface MutationSaveAuthorArgs {
  input: SaveAuthorInput;
}
export interface MutationSaveBookArgs {
  input: SaveBookInput;
}
export interface MutationSaveBookAdvanceArgs {
  input: SaveBookAdvanceInput;
}
export interface MutationSaveBookReviewArgs {
  input: SaveBookReviewInput;
}
export interface MutationSaveImageArgs {
  input: SaveImageInput;
}
export interface MutationSavePublisherArgs {
  input: SavePublisherInput;
}
export interface MutationSaveTagArgs {
  input: SaveTagInput;
}
export interface SaveAuthorResult {
  author: AuthorId;
}

export interface SaveBookResult {
  book: BookId;
}

export interface SaveBookAdvanceResult {
  bookAdvance: BookAdvanceId;
}

export interface SaveBookReviewResult {
  bookReview: BookReviewId;
}

export interface SaveImageResult {
  image: ImageId;
}

export interface SavePublisherResult {
  publisher: PublisherId;
}

export interface SaveTagResult {
  tag: TagId;
}

export interface SaveAuthorInput {
  id?: string | null | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  initials?: string | null | undefined;
  numberOfBooks?: number | null | undefined;
  isPopular?: boolean | null | undefined;
  age?: number | null | undefined;
  graduated?: Date | null | undefined;
  wasEverPopular?: boolean | null | undefined;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  mentorId?: string | null | undefined;
  publisherId?: string | null | undefined;
}

export interface SaveBookInput {
  id?: string | null | undefined;
  title?: string | null | undefined;
  order?: number | null | undefined;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  authorId?: string | null | undefined;
}

export interface SaveBookAdvanceInput {
  id?: string | null | undefined;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  status?: AdvanceStatus | null | undefined;
  bookId?: string | null | undefined;
  publisherId?: string | null | undefined;
}

export interface SaveBookReviewInput {
  id?: string | null | undefined;
  rating?: number | null | undefined;
  isPublic?: boolean | null | undefined;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  bookId?: string | null | undefined;
}

export interface SaveImageInput {
  id?: string | null | undefined;
  fileName?: string | null | undefined;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  type?: ImageType | null | undefined;
  authorId?: string | null | undefined;
  bookId?: string | null | undefined;
  publisherId?: string | null | undefined;
}

export interface SavePublisherInput {
  id?: string | null | undefined;
  name?: string | null | undefined;
  latitude?: number | null | undefined;
  longitude?: number | null | undefined;
  hugeNumber?: number | null | undefined;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  size?: PublisherSize | null | undefined;
}

export interface SaveTagInput {
  id?: string | null | undefined;
  name?: string | null | undefined;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
}

export { AdvanceStatus } from "src/entities";

export { ImageType } from "src/entities";

export { PublisherSize } from "src/entities";

export const possibleTypes = {} as const;
