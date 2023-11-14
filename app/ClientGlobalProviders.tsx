"use client";

import * as React from "react";

// 1. import `ChakraProvider` component
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";

export const theme = extendTheme({
  fonts: {
    heading: "var(--font-inter)",
    body: "var(--font-inter)",
  },
  config: {
    initialColorMode: "dark",
  },
});

const inter = Inter({ subsets: ["latin"] });

export function ClientGlobalproviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <>
      <UserProvider>
        <CacheProvider>
          <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </CacheProvider>
      </UserProvider>
      <style jsx global>
        {`
          :root {
            --font-inter: ${inter.style.fontFamily};
          }
        `}
      </style>
    </>
  );
}
