"use client";

import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";

interface BreadcrumbsProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        <li>
          <Link
            href="/"
            className="hover:text-navy dark:hover:text-cream transition-colors"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4" />
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-navy dark:hover:text-cream transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-navy dark:text-cream font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
