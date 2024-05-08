import "~/styles/globals.css";

import { Inter } from "next/font/google";
import Title from "./_components/title";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "UK MELEE RANKINGS",
  description: "Glicko2 rankings for the UK Melee scene",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} bg-zinc-900`}>
        <Title />
        {children}
      </body>
    </html>
  );
}
