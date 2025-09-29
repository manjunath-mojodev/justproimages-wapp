"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/server/users";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          setError("No verification token provided");
          setIsVerifying(false);
          return;
        }

        const { success, message } = await verifyEmail(token);

        if (success) {
          setIsVerified(true);
          toast.success(message);
        } else {
          setError(message);
          toast.error(message);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("An unexpected error occurred during verification");
        toast.error("Verification failed");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmailToken();
  }, [searchParams]);

  if (isVerifying) {
    return (
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs text-center">
              <Loader2 className="size-8 animate-spin mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">
                Verifying your email...
              </h1>
              <p className="text-muted-foreground">
                Please wait while we verify your email address.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <img
            src="/placeholder.svg"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs text-center">
              <XCircle className="size-16 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/signup">Try Again</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login">Go to Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <img
            src="/placeholder.svg"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs text-center">
            <CheckCircle className="size-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
            <p className="text-muted-foreground mb-6">
              Your email address has been successfully verified. You can now log
              in to your account.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/login">Go to Login</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
