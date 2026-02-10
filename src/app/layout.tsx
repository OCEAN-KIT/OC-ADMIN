// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import MainHeader from "@/components/main-header";

export const metadata: Metadata = {
  title: "OC-ADMIN",
  description: "Ocean Campus Admin",
  icons: {
    icon: "/oceanCampusLogo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div>
          <Providers>
            <MainHeader />
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
