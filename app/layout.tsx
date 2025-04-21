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
  title: "Khảo sát về Virtual Streamer",
  description: "Created by Virtual Streamer research team under BAAI-Lab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white text-black relative box-border">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased m-5 bg-inherit max-lg:mx-0`}
      >
        <Blob
          className="absolute"
          style={{ top: "-300px", left: "-200px" }}
        ></Blob>
        <Blob
          className="absolute"
          style={{ bottom: "3200px", left: "0px" }}
        ></Blob>
        <Blob
          className="absolute"
          style={{ bottom: "80%", left: "12px" }}
        ></Blob>

        <Blob
          className="absolute"
          style={{ bottom: "60%", left: "0px" }}
        ></Blob>

        {children}
        <Blob
          className="absolute"
          style={{ bottom: "1600px", left: "8px" }}
        ></Blob>
        <Blob
          className="absolute"
          style={{ bottom: "400px", left: "-500px" }}
        ></Blob>
      </body>
    </html>
  );
}
