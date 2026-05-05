import "@/styles/globals.css";

// The "Pixel Perfect" Animated SVG Icon (URL Encoded)
const faviconUri = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cstyle%3E.flow-line%7Bfill:none;stroke-width:8;stroke-linecap:round;stroke-dasharray:40 60;animation:stream 2s linear infinite;%7D.cyan-line%7Bstroke:%2300e5ff;%7D.grey-line%7Bstroke:%234a4a4a;%7D.white-line%7Bstroke:%23ffffff;%7D@keyframes stream%7Bfrom%7Bstroke-dashoffset:100;%7Dto%7Bstroke-dashoffset:0;%7D%7D.arrow-head%7Bfill:%2300e5ff;%7D%3C/style%3E%3Cpath class='flow-line white-line' d='M10 70 Q 30 70, 50 40'/%3E%3Cpath class='flow-line grey-line' d='M10 50 Q 30 50, 60 30'/%3E%3Cpath class='flow-line cyan-line' d='M10 30 Q 30 30, 70 20'/%3E%3Cpath class='arrow-head' d='M75 10 L95 20 L75 30 Z'/%3E%3C/svg%3E`;

export const metadata = {
  title: "HireFlow | Professional Career Acceleration",
  description: "AI-powered career architecture, profile synthesis, and professional intelligence for the world's most ambitious talent.",
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
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
