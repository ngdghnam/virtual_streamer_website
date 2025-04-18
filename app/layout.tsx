import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Blob from "@/components/Blobs/Blob";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Virtual Streamer Form",
  description: "Created by Virtual Streamer research team under BAAI-Lab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white text-black relative box-border ">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased m-5 bg-inherit`}
      >
        <Blob
          className="absolute"
          style={{ top: "-300px", left: "-440px" }}
        ></Blob>
        <Blob
          className="absolute"
          style={{ top: "-400px", right: "0px" }}
        ></Blob>
        {children}
        <Blob
          className="absolute"
          style={{ bottom: "600px", left: "12px" }}
        ></Blob>
        <Blob
          className="absolute"
          style={{ bottom: "400px", left: "-500px" }}
        ></Blob>
        <Blob
          className="absolute"
          style={{ bottom: "400px", right: "0px" }}
        ></Blob>
      </body>
    </html>
  );
}
