import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Warwick EventHub",
  description: "Discover student events and societies at Warwick.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          <div className="min-h-[calc(100vh-4rem)]">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
