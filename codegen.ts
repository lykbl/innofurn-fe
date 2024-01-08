import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost/graphql',//,process.env.GRAPHQL_ENDPOINT,
  documents: ['app/**/*.{ts,tsx}'],
  generates: {
    'app/gql/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      }
    }
  },
  ignoreNoDocuments: true,
};

export default config;
