"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, CheckCircle, XCircle, Loader2 } from "lucide-react";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid verification link");
      setIsLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess(true);
          setTimeout(() => {
            router.push("/auth/signin");
          }, 3000);
        } else {
          setError(data.error || "Failed to verify email");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-navy dark:text-cream" />
            <span className="font-cinzel text-2xl font-bold text-navy dark:text-cream">
              Marked by Trobes
            </span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-cinzel text-2xl">
              Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && (
              <div className="text-center space-y-4 py-8">
                <Loader2 className="w-16 h-16 text-navy dark:text-cream mx-auto animate-spin" />
                <p className="text-muted-foreground">Verifying your email...</p>
              </div>
            )}

            {success && !isLoading && (
              <div className="text-center space-y-4 py-4">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-navy dark:text-cream mb-2">
                    Email Verified!
                  </h3>
                  <p className="text-muted-foreground">
                    Your email has been successfully verified. You can now sign
                    in to your account.
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </div>
            )}

            {error && !isLoading && (
              <div className="text-center space-y-4 py-4">
                <XCircle className="w-16 h-16 text-red-600 mx-auto" />
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-navy dark:text-cream mb-2">
                    Verification Failed
                  </h3>
                  <p className="text-sm text-red-600 mb-4">{error}</p>
                  <p className="text-sm text-muted-foreground">
                    The verification link may have expired or is invalid.
                  </p>
                </div>
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/signup">Sign Up Again</Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/auth/signin">Go to Sign In</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
