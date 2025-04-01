import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/authContext";

export const metadata: Metadata = {
  title: "MedCare-Admin",
  description: "Healthcare in Your Hands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <AuthProvider>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Toaster position="top-right" reverseOrder={false} />
        <Footer />
      </AuthProvider>
      </body>
    </html>
  );
}