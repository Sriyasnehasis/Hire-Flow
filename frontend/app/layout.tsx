import "@/styles/globals.css";
import { Bricolage_Grotesque, DM_Sans, Lora, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";

const bricolage = Bricolage_Grotesque({ 
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const lora = Lora({ 
  subsets: ["latin"],
  variable: "--font-lora",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const faviconUri = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 80 Q 40 80, 60 40' fill='none' stroke='%231A5C4B' stroke-width='8'/%3E%3Cpath d='M20 50 Q 40 50, 70 30' fill='none' stroke='%231A5C4B' stroke-width='8' opacity='0.5'/%3E%3C/svg%3E`;

export const metadata = {
  title: "HireFlow | AI-Powered Career Platform",
  description: "Experience a premium, AI-driven career ecosystem for modern professionals.",
  icons: {
    icon: faviconUri,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable} ${lora.variable} ${jetbrains.variable}`}>
      <body className="antialiased bg-bg text-text selection:bg-accent/10 font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
