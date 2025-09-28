import { betterAuth } from "better-auth";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import VerificationEmail from "@/components/emails/verification-email";
import { toast } from "sonner";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const { data, error } = await resend.emails.send({
        from: "JustProImages <onboarding@resend.dev>",
        to: [user.email],
        subject: "Verify your email address",
        react: VerificationEmail({
          userEmail: user.email,
          verificationUrl: url,
        }),
      });

      if (error) {
        console.log(
          "Failed to send verification email. Please reach out to support@justproimages.com"
        );
      }
    },
    sendOnSignUp: true,
  },
  plugins: [nextCookies()],
});
