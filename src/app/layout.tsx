import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Addition, plainly",
  description: "A simple, clear calculator for adding two numbers.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
