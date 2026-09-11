"use server";
import { signIn } from "@/auth";

export async function loginAction() {
  return signIn("github");
}
