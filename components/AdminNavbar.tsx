// components/AdminNavbar.tsx (Minimal Version)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Menu, X, Settings } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Polls", href: "/admin/poll" },
  { name: "Create Polls", href: "/admin/poll/create" },
  // { name: "Create Admin", href: "/admin/create" },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleLogout = () => {
    sessionStorage.removeItem("auth");
    window.location.href = "/login";
  }

  return (
    <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
      <CardContent className="">
        <div className="flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Manage polls and analytics
              </p>
            </div>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <nav className="flex gap-1 bg-muted/20 rounded-lg p-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${pathname === item.href
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 space-y-2 border-t pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {item.name}
              </Link>
            ))}
            <Button variant="destructive" size="sm" className="w-full mt-2">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}