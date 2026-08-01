import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin | AVYZOR",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={fontVariables}>
      <body className="min-h-screen bg-dark-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
