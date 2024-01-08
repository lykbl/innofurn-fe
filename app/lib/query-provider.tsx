"use client"
import React, { useEffect, useState } from "react";
// import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { getCookie } from "@/lib/utils";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

function ReactQueryProvider({ children }: any) {
  useEffect(() => {
    async function initCsrf() {
      if (getCookie('XSRF-TOKEN') === null) {
        await fetch(process.env.CSRF_ENDPOINT || 'http://localhost/sanctum/csrf-cookie', {
          'method': 'GET',
          'credentials': 'include',
        });
      }
    }

    initCsrf();
  }, []);

  const [client] = useState(new QueryClient({
    defaultOptions: {
    },
  }))

  return (
    <>
      <QueryClientProvider client={client}>
        {/*<ReactQueryStreamedHydration>*/}
          {children}
        {/*</ReactQueryStreamedHydration>*/}
        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
      </QueryClientProvider>
    </>
  )
}

export { ReactQueryProvider }
