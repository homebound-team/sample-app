const { mappers, enumValues } = require("./graphql-codegen-joist");

module.exports = {
  overwrite: true,
  schema: "./schema/**/*.graphql",
  documents: null,
  generates: {
    "src/generated/graphql-types.ts": {
      config: {
        contextType: "src/context#Context",
        noSchemaStitching: true,
        avoidOptionals: true,
        scaffolding: {
          ignoreObjectsPattern: "Detail$",
        },
        scalars: {
          DateTime: "Date",
        },
        mappers,
        enumValues,
      },
      plugins: [
        "@homebound/graphql-typescript-simple-resolvers",
        "@homebound/graphql-typescript-resolver-scaffolding",
        "@homebound/graphql-typescript-possible-types",
      ],
    },
  },
};
