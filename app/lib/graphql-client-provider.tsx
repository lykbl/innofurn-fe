// 'use client';
//
// import { GraphQLClient } from "graphql-request";
// import React, { ReactNode, useContext, useEffect, useState } from "react";
// import { getCookie } from "@/lib/utils";
//
// export const GraphQLClientContext = React.createContext<GraphQLClient | undefined>(
//   undefined
// );
//
// export const useGraphQLClient = () => {
//   const client = useContext(GraphQLClientContext);
//
//   if (!client) {
//     throw new Error("useGraphQLClient must be used within a GraphQLClientProvider");
//   }
//
//   return client;
// };
//
// export type GraphQLClientProviderProps = {
//   children: ReactNode;
// }
//
// export const GraphQLClientProvider = ({
//   children
// }: GraphQLClientProviderProps): ReactNode => {
//   const [client] = useState(new GraphQLClient(
//     process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '', {
//       errorPolicy: "ignore",
//       credentials: "include",
//       mode: 'cors',
//       headers: {
//         'X-XSRF-TOKEN': getCookie("XSRF-TOKEN") || '',
//       }
//     }
//   ));
//
//   console.log('client rebuild')
//
//   useEffect(() => {
//     async function initCsrf() {
//       if (getCookie("XSRF-TOKEN") === null) {
//         await fetch(process.env.NEXT_PUBLIC_CSRF_ENDPOINT || '', {
//           "method": "GET",
//           "credentials": "include"
//         });
//       }
//     }
//     console.log('init csrf')
//
//     initCsrf();
//   }, []);
//
//   return (
//     <GraphQLClientContext.Provider value={client}>
//       {children}
//     </GraphQLClientContext.Provider>
//   );
// };
