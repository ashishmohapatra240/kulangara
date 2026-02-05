"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { ReactNode, useRef } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./store";
import { setQueryClientForAxios } from "./lib/axios";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
      setQueryClientForAxios(browserQueryClient);
    }
    return browserQueryClient;
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const googleClientId = process.env['NEXT_PUBLIC_GOOGLE_CLIENT_ID'] || "";
  const queryClient = getQueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={googleClientId}>
        {children}
        {process.env["NODE_ENV"] === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}
