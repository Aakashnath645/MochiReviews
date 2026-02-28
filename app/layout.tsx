import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MochiReviews",
    template: "%s | MochiReviews",
  },
  description:
    "Personal reviews on video games, books, TV shows, movies, and music albums — rated with the Mochimeter.",
  keywords: ["reviews", "games", "books", "movies", "tv shows", "music", "mochi"],
  openGraph: {
    siteName: "MochiReviews",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Navbar />
          <main style={{ minHeight: "calc(100vh - 200px)" }}>{children}</main>
          <Footer />
        </ThemeProvider>
        <style>{`
          @media (max-width: 680px) {
            .hidden-mobile { display: none !important; }
            .show-mobile { display: flex !important; }
          }
          @media (min-width: 681px) {
            .show-mobile { display: none !important; }
            .hidden-mobile { display: flex !important; }
          }
        `}</style>
      </body>
    </html>
  );
}
