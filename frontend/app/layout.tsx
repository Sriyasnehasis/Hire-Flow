import "@/styles/globals.css";

export const metadata = {
  title: "HireFlow - AI Career Intelligence Platform",
  description:
    "AI-powered resume building, ATS scoring, and mock interview platform for career success",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
