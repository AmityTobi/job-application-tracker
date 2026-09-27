import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JobTrack",
    template: "%s | JobTrack",
  },
  description:
    "Organize your job search, track applications, and manage your career opportunities.",
  applicationName: "JobTrack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        {children}

        <Toaster
          position="top-center"
          offset={24}
          mobileOffset={16}
          duration={4000}
          visibleToasts={3}
          expand
          closeButton
        />
      </body>
    </html>
  );
}
