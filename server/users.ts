"use server";
import { auth } from "@/lib/auth";

export const signInUser = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return { success: true, message: "User signed in successfully" };
  } catch (error) {
    const e = error as Error;

    // Check if the error is related to email verification
    if (e.message?.includes("email") && e.message?.includes("verify")) {
      return {
        success: false,
        message:
          "Please verify your email before logging in. Check your inbox for a verification email.",
        needsVerification: true,
      };
    }

    return { success: false, message: e.message || "User signed in failed" };
  }
};

export const signUpUser = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
    return { success: true, message: "User signup successfully" };
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || "User signup failed" };
  }
};

export const resendVerificationEmail = async (email: string) => {
  try {
    await auth.api.sendVerificationEmail({
      body: {
        email,
      },
    });
    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to send verification email",
    };
  }
};

export const resetPassword = async (newPassword: string, token: string) => {
  try {
    await auth.api.resetPassword({
      body: {
        newPassword: newPassword,
        token: token,
      },
    });
    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || "Password reset failed" };
  }
};

export const verifyEmail = async (token: string) => {
  try {
    await auth.api.verifyEmail({
      query: { token },
    });
    return { success: true, message: "Email verified successfully" };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Email verification failed",
    };
  }
};

export const forgetPassword = async (email: string) => {
  try {
    await auth.api.forgetPassword({
      body: { email, redirectTo: "/password-reset" },
    });
    return { success: true, message: "Password reset email sent" };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to send reset email",
    };
  }
};

export const signInWithGoogle = async () => {
  try {
    // For OAuth, we need to redirect to the OAuth provider
    // This will be handled by the client-side redirect
    return { success: true, message: "Redirecting to Google..." };
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || "Google sign-in failed" };
  }
};
