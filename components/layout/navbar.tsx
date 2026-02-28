"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/disclosure", label: "Disclosure" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Marked by Trobes"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="font-cinzel text-xl font-bold text-navy dark:text-cream">
              Marked by Trobes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-cinzel text-sm transition-colors hover:text-navy dark:hover:text-cream ${
                  pathname === item.href
                    ? "text-navy dark:text-cream font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {session?.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="font-cinzel text-sm text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Admin
              </Link>
            )}

            <ThemeToggle />

            {session ? (
              <Button variant="outline" size="sm" asChild>
                <Link href="/api/auth/signout">Sign Out</Link>
              </Button>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full"
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-4 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`font-cinzel text-sm ${
                      pathname === item.href
                        ? "text-navy dark:text-cream font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                {session?.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="font-cinzel text-sm text-red-600"
                  >
                    Admin
                  </Link>
                )}

                {session ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <Link href="/api/auth/signout">Sign Out</Link>
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
