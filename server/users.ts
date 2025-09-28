"use server";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

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
