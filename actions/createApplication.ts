"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import z from "zod";

export async function createApplicationAction(
  prevState: unknown,
  formData: FormData,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      errors: { message: "User not authenticated" },
    };
  }

  const schema = z.object({
    companyName: z.string().min(3).max(100),
    roleDescription: z.preprocess(
      (val) => (val === "" || val === null ? undefined : val),
      z.string().min(10).max(500).optional(),
    ),
    role: z.string().min(2).max(100),
    status: z.enum(["APPLIED", "REJECTED", "INTERVIEW"]),
    link: z.url(),
    dateApplied: z.coerce.date().optional(),
  });

  const data = schema.safeParse({
    companyName: formData.get("companyName"),
    roleDescription: formData.get("roleDescription"),
    role: formData.get("role"),
    status: formData.get("status"),
    link: formData.get("link"),
    dateApplied: formData.get("dateApplied"),
  });

  if (!data.success) {
    return {
      success: false,
      errors: z.treeifyError(data.error),
    };
  }

  await db.application.create({
    data: {
      companyName: data.data.companyName,
      role: data.data.role,
      status: data.data.status,
      link: data.data.link,
      dateApplied: data.data.dateApplied,
      roleDescription: data.data.roleDescription,
      userId: session?.user?.id,
    },
  });

  return {
    success: true,
    errors: null,
  };
}
