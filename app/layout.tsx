import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Ensure your Tailwind CSS is imported here

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EmailBlaster - Bulk Email Platform",
  description: "Send high-throughput campaigns with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}