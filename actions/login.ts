"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

type AuthProvider = "google" | "github";

export async function loginAction(provider: AuthProvider) {
  try {
    await signIn(provider, {
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: error.type,
      };
    }

    throw error;
  }
}
