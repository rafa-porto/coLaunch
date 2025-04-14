import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Quicksand } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "coLaunch - Descubra e compartilhe produtos digitais",
  description:
    "Uma plataforma para criadores e desenvolvedores publicarem, divulgarem e receberem feedback sobre seus produtos e projetos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quicksand.variable} antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Flavors&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-quicksand">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
