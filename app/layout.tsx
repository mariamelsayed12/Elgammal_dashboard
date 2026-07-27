import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReduxProvider } from "@/redux/provider";
import InternetConnectionProvider from "@/provider/InternetConnectionServicesProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "300",
    "400",
    "500",
    "600",
    "700",
    "800"
  ],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Elgammal - Dashboard",
  description: "Elgammal - Dashboard",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <InternetConnectionProvider>
            {children}
            <Toaster />
          </InternetConnectionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
