"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, LogOut } from "lucide-react";

export default function SignOutPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-navy dark:text-cream hover:opacity-80 transition-opacity"
          >
            <BookOpen className="w-8 h-8" />
            Marked by Trobes
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-navy/10 dark:bg-cream/10 rounded-full flex items-center justify-center mb-2">
              <LogOut className="w-6 h-6 text-navy dark:text-cream" />
            </div>
            <CardTitle className="text-2xl">Sign Out</CardTitle>
            <CardDescription>
              Are you sure you want to sign out of your account?
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Signing out..." : "Yes, Sign Out"}
            </Button>

            <Button
              variant="outline"
              asChild
              className="w-full"
              disabled={isLoading}
            >
              <Link href="/">Cancel</Link>
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          You&apos;ll be redirected to the home page after signing out.
        </p>
      </div>
    </div>
  );
}
