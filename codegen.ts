import { CodegenConfig } from "@graphql-codegen/cli";
import { addTypenameSelectionDocumentTransform } from "@graphql-codegen/client-preset";

const config: CodegenConfig = {
  schema: process.env.GRAPHQL_ENDPOINT || "http://localhost/graphql",
  documents: ["app/**/*.{ts,tsx}"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "app/gql/": {
      preset: "client",
      config: {
        strictScalars: true,
        scalars: {
          IntID: "number",
          DateTime: "Date",
          Dimension: "{format: string, value: number, unit: string}",
          Email: "string",
          JSON: "{[key: string]: any}",
          Phone: "number | string",
          Price: "number",
          Rating: "1 | 2 | 3 | 4 | 5",
          PriceData: "{amount: number, currency: string}",
          AttributeData: "Record<string, {type: string, value: string|null}>", //TODO add enum key types
          Map: 'Map',
        },
        enumsAsTypes: false,
        constEnums: true,
        namingConvention: {
          typeNames: "change-case-all#pascalCase",
          enumValues: "change-case-all#upperCase",
        },
      },
      presetConfig: {
        gqlTagName: "gql",
        // fragmentMasking: false
      },
      // documentTransforms: [addTypenameSelectionDocumentTransform]
    },
  },
};

export default config;
