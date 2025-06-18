import "./globals.css";
import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { defaultItems } from "./data/marquee";
import Marquee from "./components/layout/Marquee";
import { Providers } from "./providers";

const josefin = Josefin_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kulangara - Coming Soon",
  description: "Bhubaneswar based fashion wear store with khanti Odia touch",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={josefin.className}>
        <Providers>
          <Marquee items={defaultItems} />
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
