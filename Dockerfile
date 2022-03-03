# Run codegen and build first
FROM node:14.8.0 as build
ARG NPM_TOKEN
WORKDIR /home/node/app
COPY package.json package-lock.json .npmrc ./
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> .npmrc && \
  npm ci && \
  npm cache clean --force && \
  rm -fr .npmrc
COPY ./graphql-codegen-joist.js ./
COPY ./graphql-codegen.js ./
COPY ./tsconfig.json ./
COPY ./migrations ./migrations
COPY ./schema ./schema
COPY ./src ./src
RUN npm run graphql-codegen
RUN npm run build

# Install production dependencies in a separate stage. This isn't done in the
# runtime stage to keep the NPM_TOKEN out of the docker image history.
FROM node:14.8.0 as proddeps
ARG NPM_TOKEN
WORKDIR /home/node/app
COPY package.json package-lock.json .npmrc ./
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> .npmrc && \
  npm ci --only production && \
  npm cache clean --force && \
  rm -fr .npmrc

# build the final runtime image
FROM node:14.8.0 as runtime
ARG NPM_TOKEN
WORKDIR /home/node/app
COPY package.json package-lock.json .npmrc ./
COPY tsconfig.json ./
COPY ./schema ./schema
COPY --from=build /home/node/app/dist/src ./src
COPY --from=build /home/node/app/dist/migrations ./migrations
COPY --from=proddeps /home/node/app/node_modules ./node_modules
CMD ["node", "src/server.js"]
EXPOSE 4000
