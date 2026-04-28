import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-heading", subsets: ["latin"], weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  title: "Kolaborate AI — Freelance Toolkit",
  description: "AI-powered proposal writer and scope estimator for freelancers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jakarta.variable} antialiased min-h-screen bg-background`}>
        {children}
      </body>
    </html>
  );
}
