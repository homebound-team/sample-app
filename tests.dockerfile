FROM node:14.8.0
ARG NPM_TOKEN
WORKDIR /home/node/app
COPY package.json package-lock.json ./
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
RUN npm install --unsafe-perm
#COPY ./joist-codegen.json ./
#COPY ./graphql-codegen-joist.js ./
COPY ./graphql-codegen.js ./
COPY ./.prettierrc ./
COPY ./jest.config.ts ./
COPY ./run.sh ./
COPY ./tsconfig.json ./
#COPY ./.eslintrc.js ./
#COPY ./.eslintignore ./
COPY ./env ./env
COPY ./migrations ./migrations
COPY ./schema ./schema
COPY ./src ./src
RUN npm run graphql-codegen
CMD sleep infinity
