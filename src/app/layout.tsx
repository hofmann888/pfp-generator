import type { Metadata } from "next";
import localFont from "next/font/local";
import TelegramProvider from "@/components/TelegramProvider";
import "@/css/global.css";
import "@/css/embla.css";

const marvinRegular = localFont({
  src: "../fonts/Marvin.ttf",
  variable: "--font-marvin-regular",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Build your Pyrate pfp!",
  description: "Made by $PYRATE.",
  applicationName: "Pyrate pfp",
  icons: "/img/favicon.avif",
  openGraph: {
    title: 'Build your Pyrate pfp!',
    description: 'Made by $PYRATE.',
    url: process.env.SITE_URL,
    siteName: 'Pyrate pfp',
    images: [
      {
        url: `${process.env.SITE_URL}/img/favicon.avif`,
        alt: 'Pyrate pfp',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${marvinRegular.variable} antialiased text-shadow-contur`}>
        <TelegramProvider>
          {children}
        </TelegramProvider>
      </body>
    </html>
  );
}
