"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { queryClient } from "./lib/queryClient";
import { store } from "./store";

export function Providers({ children }: { children: ReactNode }) {
  const googleClientId = process.env['NEXT_PUBLIC_GOOGLE_CLIENT_ID'] || "";

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={googleClientId}>
        {children}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}
