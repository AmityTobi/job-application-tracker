"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { applicationSchema } from "@/lib/validations/application";
import { revalidatePath } from "next/cache";
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

  const data = applicationSchema.safeParse({
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

  try {
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

    revalidatePath("/");

    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        message:
          "Could not create the application. You may not have permission.",
      },
    };
  }
}
