import type { Metadata } from "next";
import "./globals.css";
import { space_mono } from "./fonts";

export const metadata: Metadata = {
  title: "Melee Ranked UK",
  description: "Glicko2 rankings for Melee players in the UK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${space_mono.className} antialiased bg-zinc-800`}>
        {children}
      </body>
    </html>
  );
}
