import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.GRAPHQL_ENDPOINT || 'http://localhost/graphql',
  documents: ['app/**/*.{ts,tsx}'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    'app/gql/generated/': {
      preset: 'client',
      config: {
        strictScalars: true,
        scalars: {
          IntID: 'number',
          DateTime: 'Date',
          Dimension: '{format: string, value: number, unit: string}',
          Email: 'string',
          JSON: '{[key: string]: object | string | number | boolean | null }',
          Phone: 'number | string',
          Price: 'number',
          Rating: 'Rating',
          PriceData: 'PriceData',
          AttributeData: 'AttributeData',
          Map: 'Map',
          DiscountData: 'DiscountData',
          AggregatedValues: 'Array',
          ReviewsBreakdown: 'ReviewsBreakdown',
        },
        enumsAsTypes: false,
        constEnums: true,
        namingConvention: {
          typeNames: 'change-case-all#pascalCase',
          enumValues: 'change-case-all#upperCase',
        },
      },
      presetConfig: {
        gqlTagName: 'gql',
        // fragmentMasking: false
      },
      // documentTransforms: [addTypenameSelectionDocumentTransform]
    },
  },
};

export default config;
