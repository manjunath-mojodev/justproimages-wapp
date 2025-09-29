import { betterAuth } from "better-auth";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import VerificationEmail from "@/components/emails/verification-email";
import PasswordResetEmail from "@/components/emails/password-reset";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      // Construct the password reset URL to point to our password reset page with token
      const baseUrl =
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
        process.env.NEXTAUTH_URL ||
        "http://localhost:3000";
      const resetUrl = `${baseUrl}/password-reset?token=${token}`;

      const { data, error } = await resend.emails.send({
        from: "JustProImages <onboarding@resend.dev>",
        to: [user.email],
        subject: "Reset your password",
        react: PasswordResetEmail({
          userEmail: user.email,
          resetUrl: resetUrl,
          userName: user.name,
        }),
      });

      if (error) {
        console.log(
          "Failed to send Password Reset email - " +
            user.email +
            " - " +
            error.message
        );
      }
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // Construct the verification URL to point to our verification page
      const baseUrl =
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
        process.env.NEXTAUTH_URL ||
        "http://localhost:3000";
      const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

      const { data, error } = await resend.emails.send({
        from: "JustProImages <onboarding@resend.dev>",
        to: [user.email],
        subject: "Verify your email address",
        react: VerificationEmail({
          userEmail: user.email,
          verificationUrl: verificationUrl,
        }),
      });

      if (error) {
        console.log(
          "Failed to send verification email - " +
            user.email +
            " - " +
            error.message
        );
      }
    },
    sendOnSignUp: true,
  },
  plugins: [nextCookies()],
});
