"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { CommandPalette } from "./CommandPalette";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Authenticated workspace route detection
  const isAuthenticatedWorkspace = /^\/(gov|startup|expert|validator|admin|procurement)(\/|$)/.test(
    pathname
  );

  // Global keyboard shortcut for Command Palette (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile drawer on route transition
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (isAuthenticatedWorkspace) {
    return (
      <div className="min-h-screen flex bg-gov-bg text-gov-text font-sans antialiased">
        {/* Skip to Main Content Link for Keyboard / Screen Reader Users (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-gov-primary focus:text-white focus:font-semibold focus:text-xs focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Responsive Role-Aware Sidebar */}
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Workspace Main Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Navigation Bar */}
          <TopNav
            onOpenMobile={() => setIsMobileOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />

          {/* Scrollable Content Container */}
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 focus:outline-none"
          >
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>

        {/* Global Command / Search Palette */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
      </div>
    );
  }

  // Public Layout (Home, Challenges, Solutions, Design System, Auth, Unauthorized)
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gov-bg text-gov-text antialiased selection:bg-blue-100 selection:text-gov-primary">
      {/* Skip to Main Content Link for Keyboard / Screen Reader Users (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-gov-primary focus:text-white focus:font-semibold focus:text-xs focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        Skip to main content
      </a>

      <Navbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 focus:outline-none"
      >
        {children}
      </main>
      <Footer />

      {/* Global Command / Search Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
