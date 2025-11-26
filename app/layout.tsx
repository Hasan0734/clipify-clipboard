import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AppContainer from "@/components/AppContainer";
import TrayMenuHandler from "@/components/TrayMenuHandler";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${inter.variable} antialiased`}>
        {/* <Header /> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TrayMenuHandler />

          <AppContainer>{children}</AppContainer>
        </ThemeProvider>
      </body>
    </html>
  );
}
