import Navbar from "@/components/Navbar";
import { Providers } from "@/providers/session-provider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins", // Optional: for CSS variable
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resume Analyzer",
  description: "AI Powered Resume Analyzer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
      <body className={poppins.className}>
        <Providers>
          <Navbar />
          <Toaster position="bottom-center" />
          {children}
        </Providers>
      </body>
    </html>
  );
}