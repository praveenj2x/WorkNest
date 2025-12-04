import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ghostnet.dev"),
  title: "GhostNet - Haunt Your Workflow with Spectral Intelligence",
  description: "Unleash supernatural productivity with AI-powered insights that materialize from the shadows. A phantom-powered platform that brings your team's potential back from the dead.",
  keywords: ["ghost", "halloween", "spooky", "AI-powered", "supernatural productivity", "phantom workforce", "spectral management"],
  authors: [{ name: "GhostNet Team" }],
  creator: "GhostNet",
  publisher: "GhostNet",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ghostnet.dev",
    title: "GhostNet - Haunt Your Workflow with Spectral Intelligence",
    description: "Unleash supernatural productivity with AI-powered insights that materialize from the shadows.",
    siteName: "GhostNet",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GhostNet - Haunt Your Workflow with Spectral Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GhostNet - Haunt Your Workflow with Spectral Intelligence",
    description: "Unleash supernatural productivity with AI-powered insights that materialize from the shadows.",
    creator: "@ghostnet",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#6a0dad",
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
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
