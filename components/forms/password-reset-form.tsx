"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/server/users";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const formSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function PasswordResetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setTokenError("No reset token provided");
      setIsTokenValid(false);
    }
  }, [token]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      if (!token) {
        toast.error("No reset token provided");
        return;
      }

      if (values.password !== values.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const { success, message } = await resetPassword(values.password, token);

      if (success) {
        toast.success(message);
        router.push("/login");
      } else {
        console.error("Reset password error:", message);
        if (message?.includes("expired")) {
          toast.error("This reset link has expired. Please request a new one.");
          setTokenError("This password reset link has expired");
          setIsTokenValid(false);
        } else if (message?.includes("invalid")) {
          toast.error("Invalid reset link. Please request a new one.");
          setTokenError("Invalid reset token");
          setIsTokenValid(false);
        } else {
          toast.error(message || "Password reset failed");
        }
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("An error occurred while resetting your password");
    } finally {
      setIsLoading(false);
    }
  }

  // Error state for missing tokens
  if (tokenError && !isTokenValid) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertCircle className="size-16 text-destructive" />
        <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
        <p className="text-muted-foreground mb-6">{tokenError}</p>
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/forgot-password">Request New Reset Link</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show the form if token exists
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <CheckCircle className="size-8 text-green-600" />
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password below to reset your password
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Confirm Password</FormLabel>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
