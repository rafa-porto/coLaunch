import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Inter, Flavors } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const flavors = Flavors({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-flavors",
});

export const metadata: Metadata = {
  title:
    "coLaunch - Discover and share digital products created by developers and makers",
  description:
    "A platform for creators and developers to publish, promote and receive feedback on their products and projects.",
  keywords: [
    "coLaunch",
    "Product Hunt",
    "Product Discovery",
    "Product Sharing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${flavors.variable} antialiased`}
      suppressHydrationWarning
    >
      <head />
      <body className="font-inter" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
