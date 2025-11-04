import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorkNest - Empower HR with Intelligence",
  description: "Transform your workplace with AI-powered HR insights, streamlined workflows, and intelligent automation that puts people first. Modern HR management platform in development.",
  keywords: ["HR management", "human resources", "AI-powered", "workforce analytics", "employee onboarding", "performance management"],
  authors: [{ name: "WorkNest Team" }],
  creator: "WorkNest",
  publisher: "WorkNest",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://worknest.dev",
    title: "WorkNest - Empower HR with Intelligence",
    description: "Transform your workplace with AI-powered HR insights, streamlined workflows, and intelligent automation that puts people first.",
    siteName: "WorkNest",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WorkNest - Empower HR with Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WorkNest - Empower HR with Intelligence",
    description: "Transform your workplace with AI-powered HR insights, streamlined workflows, and intelligent automation that puts people first.",
    creator: "@worknest",
    images: ["/og-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#001BB7" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
