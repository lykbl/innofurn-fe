"use client"
import React, { useEffect, useState } from "react";
// import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

function ReactQueryProvider({ children }: any) {
  const [client] = useState(new QueryClient({
    defaultOptions: {
    },
  }))

  return (
      <QueryClientProvider client={client}>
        {/*<ReactQueryStreamedHydration>*/}
          {children}
        {/*</ReactQueryStreamedHydration>*/}
        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
      </QueryClientProvider>
  )
}

export { ReactQueryProvider }
