import type { Metadata, Viewport } from "next";
import { Syne, Plus_Jakarta_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["500", "700", "800"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PRESSURE POINTS | The Truth About Student Life",
  description:
    "A raw, cinematic exploration of stress, academic pressure, peer comparison, and the power to break the silence. Come for the pressure, leave with the power.",
  keywords: [
    "student mental health",
    "academic burnout",
    "imposter syndrome",
    "pressure points",
    "student stress relief",
    "box breathing",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${plusJakarta.variable} ${bebasNeue.variable} dark scroll-smooth`}
    >
      <body className="min-h-screen bg-[#0a0a0c] text-[#f1f1f5] font-sans antialiased selection:bg-rose-600/30 selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
