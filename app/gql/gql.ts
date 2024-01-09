/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    mutation LoginTest ($email: String!, $password: String!) {\n        login(email: $email, password: $password) {\n            id\n        }\n    }\n": types.LoginTestDocument,
    "\n    mutation SignUp ($input: SignUpInput!) {\n        signUp (input: $input) {\n            id\n        }\n    }\n": types.SignUpDocument,
    "\n  query UserReviews {\n      getUserReviews {\n          id\n          title\n          body\n      }\n  }\n": types.UserReviewsDocument,
    "\n  query CheckMe {\n    checkMe {\n      id\n    }\n  }\n": types.CheckMeDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation LoginTest ($email: String!, $password: String!) {\n        login(email: $email, password: $password) {\n            id\n        }\n    }\n"): (typeof documents)["\n    mutation LoginTest ($email: String!, $password: String!) {\n        login(email: $email, password: $password) {\n            id\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation SignUp ($input: SignUpInput!) {\n        signUp (input: $input) {\n            id\n        }\n    }\n"): (typeof documents)["\n    mutation SignUp ($input: SignUpInput!) {\n        signUp (input: $input) {\n            id\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UserReviews {\n      getUserReviews {\n          id\n          title\n          body\n      }\n  }\n"): (typeof documents)["\n  query UserReviews {\n      getUserReviews {\n          id\n          title\n          body\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query CheckMe {\n    checkMe {\n      id\n    }\n  }\n"): (typeof documents)["\n  query CheckMe {\n    checkMe {\n      id\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;