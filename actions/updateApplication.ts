"use server";

import { applicationSchema } from "@/lib/validations/application";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import z from "zod";

export async function updateApplicationAction(
  prevState: unknown,
  formData: FormData,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      errors: { message: "user not authenticated" },
    };
  }

  const data = applicationSchema.partial().extend({
    id: z.string(),
  });

  const result = data.safeParse({
    id: formData.get("id"),
    companyName: formData.get("companyName"),
    roleDescription: formData.get("roleDescription"),
    role: formData.get("role"),
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
        roleDescription: result.data.roleDescription,
        role: result.data.role,
        status: result.data.status,
        link: result.data.link,
        dateApplied: result.data.dateApplied,
      },
    });

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
