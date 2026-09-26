import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/auth/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "GovInnovate | Government Innovation Procurement & Pilot Management Platform",
  description:
    "An enterprise GovTech operating system moving public challenges from Problem Statement to Startup Discovery, Evaluation, Pilot, Evidence, Validation, and Procurement Scale-up.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-gov-bg text-gov-text antialiased selection:bg-blue-100 selection:text-gov-primary">
        <AuthProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
