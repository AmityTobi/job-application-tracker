"use server";

import { applicationSchema } from "@/lib/validations/application";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function updateApplicationAction(
  prevState: unknown,
  formData: FormData,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      errors: {
        message: "User not authenticated",
      },
    };
  }

  const updateApplicationSchema = applicationSchema.partial().extend({
    id: z.string().min(1),
  });

  const result = updateApplicationSchema.safeParse({
    id: formData.get("id"),
    companyName: formData.get("companyName"),
    role: formData.get("role"),
    roleDescription: formData.get("roleDescription"),
    location: formData.get("location"),
    workMode: formData.get("workMode"),
    status: formData.get("status"),
    link: formData.get("link"),
    dateApplied: formData.get("dateApplied"),
  });

  if (!result.success) {
    return {
      success: false,
      errors: z.treeifyError(result.error),
    };
  }

  try {
    await db.application.update({
      where: {
        id: result.data.id,
        userId: session.user.id,
      },
      data: {
        companyName: result.data.companyName,
        role: result.data.role,
        roleDescription: result.data.roleDescription,
        location: result.data.location,
        workMode: result.data.workMode,
        status: result.data.status,
        link: result.data.link,
        dateApplied: result.data.dateApplied,
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
          "Could not update application. It may not exist or you may not have permission.",
      },
    };
  }
}
