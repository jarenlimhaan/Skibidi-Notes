import type { Metadata } from "next";
import "./globals.css";

import Providers from "./providers/providers";
import AppWrapper from "@/components/auth/appWrapper";

export const metadata: Metadata = {
  title: "Skibidi Notes",
  description: "Your Favourite Educational Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppWrapper>
            {children}
          </AppWrapper>
        </Providers>
      </body>
    </html>
  );
}
