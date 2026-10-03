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
  metadataBase: new URL("https://keepjobtrack.vercel.app"),

  title: {
    default: "JobTrack",
    template: "%s | JobTrack",
  },

  description:
    "Organize your job search, track applications, and manage your career opportunities.",

  applicationName: "JobTrack",

  openGraph: {
    type: "website",
    siteName: "JobTrack",
    title: "JobTrack — Job Application Tracker",
    description:
      "Organize your job search, track applications, and manage your career opportunities.",
    url: "https://keepjobtrack.vercel.app",
  },

  twitter: {
    card: "summary_large_image",
    title: "JobTrack — Job Application Tracker",
    description:
      "Organize your job search, track applications, and manage your career opportunities.",
  },
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
