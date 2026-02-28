"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createAmazonLink } from "@/lib/affiliate";

interface Book {
  id: string;
  title: string;
  author: string;
  image: string | null;
  amazonLink: string;
  summary: string;
  whoFor: string | null;
  emotionalPoints: string[];
}

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Book Image */}
          {book.image && (
            <div className="flex-shrink-0">
              <div className="relative w-full md:w-48 h-64 md:h-72">
                <Image
                  src={book.image}
                  alt={`${book.title} by ${book.author}`}
                  fill
                  className="object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          )}

          {/* Book Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-cinzel text-2xl font-bold text-navy dark:text-cream mb-1">
                📘 {book.title}
              </h3>
              <p className="text-lg text-muted-foreground">by {book.author}</p>
            </div>

            {/* Summary */}
            <p className="text-muted-foreground">{book.summary}</p>

            {/* Who it's for */}
            {book.whoFor && (
              <div>
                <h4 className="font-semibold text-navy dark:text-cream mb-2">
                  Perfect for:
                </h4>
                <p className="text-muted-foreground">{book.whoFor}</p>
              </div>
            )}

            {/* Emotional Points */}
            {book.emotionalPoints.length > 0 && (
              <div>
                <h4 className="font-semibold text-navy dark:text-cream mb-2">
                  Why you&apos;ll love it:
                </h4>
                <ul className="space-y-1">
                  {book.emotionalPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-navy dark:text-cream mt-1">•</span>
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="amazon" size="lg" asChild>
                <a
                  href={createAmazonLink(book.amazonLink)}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="group"
                >
                  Get on Amazon
                  <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href={createAmazonLink(book.amazonLink)}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                >
                  Check Price
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
