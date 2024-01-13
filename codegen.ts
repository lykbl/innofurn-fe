import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost/graphql',//,process.env.GRAPHQL_ENDPOINT,
  documents: ['app/**/*.{ts,tsx}'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    'app/gql/': {
      preset: 'client',
      plugins: [
        // 'typescript',
        // 'typescript-resolvers'
      ],
      // config: {
      //   scalars: {
      //     // DateTime: Date,
      //     DateTime: 'scalars#DateTime',
      //   }
      // },
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

export default config;
