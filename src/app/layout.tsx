import type { Metadata } from "next";
import "./globals.css";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Velysium — Applications Métiers pour l'Entreprise Marocaine",
  description:
    "Velysium conçoit des applications desktop, des agents IA souverains et de l'automatisation comptable pour les entreprises marocaines — déployés en local, zéro fuite cloud.",
  keywords: [
    "Velysium",
    "logiciel comptabilité Maroc",
    "attestation RH",
    "automatisation juridique",
    "agent IA souverain",
    "cybersécurité OSINT",
    "enterprise software Maroc",
  ],
  openGraph: {
    title: "Velysium — Applications Métiers pour l'Entreprise Marocaine",
    description:
      "Applications desktop, agents IA, automatisation comptable — du code qui tourne pour les entreprises marocaines.",
    type: "website",
    url: "https://velysium-projects.me",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velysium — Applications Métiers",
    description: "Applications desktop et IA souveraines pour l'entreprise marocaine.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="grain">
      <body>
        <SmoothScroll>
          <Cursor />
          <ScrollProgress />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
