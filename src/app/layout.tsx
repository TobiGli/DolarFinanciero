import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "DolarFinanciero | Cotización del dólar hoy",
  description: "Cotización del dólar oficial, blue, MEP, CCL y otras monedas en Argentina.",
  openGraph: {
    title: "DolarFinanciero | Cotización del dólar hoy",
    description: "Información financiera para consultar el dólar en Argentina de un vistazo.",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <body className={`${spaceGrotesk.variable} ${ibmPlexSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
