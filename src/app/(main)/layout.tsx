import Navbar from "@/components/navbar";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      {/* Toaster is already included in the root layout */}
    </>
  );
}
