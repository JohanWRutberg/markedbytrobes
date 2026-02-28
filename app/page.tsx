"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookHeart, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-cinzel text-4xl md:text-6xl lg:text-7xl font-bold text-navy dark:text-cream mb-6">
              Discovering Books That Leave Their Mark
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Book reviews, recommendations, and curated lists for passionate
              readers who want their next great read.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" asChild>
                <Link href="/blog">
                  Explore Books <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="#categories">Browse Categories</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 -right-20 w-64 h-64 bg-cream/20 dark:bg-navy/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-navy/10 dark:bg-cream/10 rounded-full blur-3xl"
        />
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-cream/20 dark:bg-navy/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-navy dark:text-cream mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find your next favorite book organized by genre and theme
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((category, index) => (
              <motion.div
                key={category.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/blog/category/${category.value.toLowerCase()}`}
                  className="block p-6 rounded-lg bg-background border border-border hover:border-navy dark:hover:border-cream transition-all hover:shadow-lg group"
                >
                  <h3 className="font-cinzel font-semibold text-lg text-navy dark:text-cream group-hover:scale-105 transition-transform">
                    {category.label}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream dark:bg-navy mb-4">
                <BookHeart className="w-8 h-8 text-navy dark:text-cream" />
              </div>
              <h3 className="font-cinzel text-xl font-semibold mb-2 text-navy dark:text-cream">
                Curated Reviews
              </h3>
              <p className="text-muted-foreground">
                Honest, detailed reviews of books that truly resonate
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream dark:bg-navy mb-4">
                <Sparkles className="w-8 h-8 text-navy dark:text-cream" />
              </div>
              <h3 className="font-cinzel text-xl font-semibold mb-2 text-navy dark:text-cream">
                Book Lists
              </h3>
              <p className="text-muted-foreground">
                Expertly curated lists for every mood and occasion
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream dark:bg-navy mb-4">
                <TrendingUp className="w-8 h-8 text-navy dark:text-cream" />
              </div>
              <h3 className="font-cinzel text-xl font-semibold mb-2 text-navy dark:text-cream">
                What&apos;s Trending
              </h3>
              <p className="text-muted-foreground">
                Stay updated with the latest must-read books
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy dark:bg-cream">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-cream dark:text-navy mb-6">
              Start Your Reading Journey Today
            </h2>
            <p className="text-cream/80 dark:text-navy/80 mb-8 text-lg">
              Join our community of book lovers and never miss a great read
            </p>
            <Button size="xl" variant="secondary" asChild>
              <Link href="/blog">
                Browse All Books <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
