import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PIK | Belleza y bienestar",
  description: "Encuentra tu próximo momento de bienestar y haz crecer tu negocio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
