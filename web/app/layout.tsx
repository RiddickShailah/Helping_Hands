import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Providers from "@/components/Providers";
import SecurityBanner from "@/components/SecurityBanner";
import SecurityFooter from "@/components/SecurityFooter";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

export const metadata = {
  title: "Helping Hands — Know Your Community",
  description: "Discover local campaigns, donate securely, volunteer, and explore your community on the map.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="pb-16 md:pb-0">
        <Providers>
          <SecurityBanner />
          <Nav />
          <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
          <SecurityFooter />
        </Providers>
      </body>
    </html>
  );
}
