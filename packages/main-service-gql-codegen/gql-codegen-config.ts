import { type CodegenConfig } from '@graphql-codegen/cli';

export default {
  watch: true,
  overwrite: true,
  emitLegacyCommonJSImports: false,
  schema: '../main-service/src/graphqlStuff/initGqlSchema/**/*.graphql',
  generates: {
    '../main-service/src/graphqlStuff/initGqlSchema/generated/graphql-schema.d.ts': {
      plugins: [
        'typescript',
        'typescript-resolvers',
        { add: { content: "import { DeepPartial } from 'utility-types';" } },
      ],
      config: {
        useIndexSignature: false,
        enumsAsTypes: true,
        contextType: '../graphqlStuff/initGqlSchema/appGqlContext.ts#AppGqlContextValue',
        defaultMapper: 'DeepPartial<{T}>',
        mappers: {
          // SymbolHolding: '../SymbolHoldingModel#SymbolHoldingModel',
        },
      },
    },
  },
} satisfies CodegenConfig;
