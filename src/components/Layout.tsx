import React from "react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-primary">
            Rent4U
          </a>
          <div className="flex gap-4">
            <a href="/properties" className="text-gray-600 hover:text-primary">
              Properties
            </a>
            <a href="/tenant/saved" className="text-gray-600 hover:text-primary">
              Saved
            </a>
            <Button variant="outline">Sign Out</Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Rent4U. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;