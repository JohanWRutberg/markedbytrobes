import Link from "next/link";
import { BookOpen, Instagram, Twitter, Mail } from "lucide-react";
import { AFFILIATE_DISCLOSURE_SHORT } from "@/lib/affiliate";
import { CATEGORIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Affiliate Disclosure */}
        <div className="mb-8 rounded-lg bg-cream/30 dark:bg-navy/30 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {AFFILIATE_DISCLOSURE_SHORT}{" "}
            <Link
              href="/disclosure"
              className="underline hover:text-navy dark:hover:text-cream"
            >
              Full disclosure
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-navy dark:text-cream" />
              <span className="font-cinzel text-lg font-bold text-navy dark:text-cream">
                Marked by Trobes
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discovering books that leave their mark. Book reviews and
              recommendations for passionate readers.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-cinzel font-semibold mb-4 text-navy dark:text-cream">
              Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((category) => (
                <li key={category.value}>
                  <Link
                    href={`/blog/category/${category.value.toLowerCase()}`}
                    className="text-muted-foreground hover:text-navy dark:hover:text-cream transition-colors"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-cinzel font-semibold mb-4 text-navy dark:text-cream">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-navy dark:hover:text-cream"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/disclosure"
                  className="text-muted-foreground hover:text-navy dark:hover:text-cream"
                >
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signin"
                  className="text-muted-foreground hover:text-navy dark:hover:text-cream"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-cinzel font-semibold mb-4 text-navy dark:text-cream">
              Connect
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-navy dark:hover:text-cream"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-navy dark:hover:text-cream"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@markedbytrobes.com"
                className="text-muted-foreground hover:text-navy dark:hover:text-cream"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Marked by Trobes. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
