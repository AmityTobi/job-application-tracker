"use server";
import { signOut } from "@/auth";

export async function logoutAction() {
  return signOut();
}
