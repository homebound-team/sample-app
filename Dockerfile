# Run codegen and build first
FROM node:14.8.0 as build
ARG NPM_TOKEN
WORKDIR /home/node/app
COPY package.json package-lock.json ./
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
RUN npm ci
# COPY ./graphql-codegen-joist.js ./
COPY ./graphql-codegen.js ./
COPY ./tsconfig.json ./
#COPY ./.eslintrc.js ./
#COPY ./.eslintignore ./
COPY ./migrations ./migrations
COPY ./schema ./schema
COPY ./src ./src
RUN npm run graphql-codegen
RUN npm run build

# Now start over with out dev dependencies
FROM node:14.8.0 as runtime
ARG NPM_TOKEN
WORKDIR /home/node/app
COPY package.json package-lock.json ./
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
RUN npm ci --only=production

COPY tsconfig.json ./
COPY ./schema ./schema
COPY --from=build /home/node/app/dist/src ./src
COPY --from=build /home/node/app/dist/migrations ./migrations
CMD ["node", "src/server.js"]
EXPOSE 4000
