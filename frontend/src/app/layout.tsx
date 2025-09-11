import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnonymousSignIn from "@/components/AnonymousSignIn";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZeroShare - Securely Share a Password or One-Time Secret",
  description:
    "Send sensitive information with Client-Side AES-GCM Encryption, One-Time Self-Destructing Links, Zero Logs & Zero Activity Tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <AnonymousSignIn />
      </body>
    </html>
  );
}
