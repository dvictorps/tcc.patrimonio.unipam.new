'use client'
// app/layout.tsx
import Sidebar from "@/components/Sidebar";
import { Providers } from "./providers";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Sidebar>
            {children}
          </Sidebar>
        </Providers>
      </body>
    </html>
  );
}