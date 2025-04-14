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
  title: "coLaunch - Discover and share digital products created by developers and makers",
  description:
    "A platform for creators and developers to publish, promote and receive feedback on their products and projects.",
  keywords: ["coLaunch", "Product Hunt", "Product Discovery", "Product Sharing"],
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
