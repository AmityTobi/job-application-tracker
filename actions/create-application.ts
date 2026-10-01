"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { applicationSchema } from "@/lib/validations/application";
import z from "zod";

export type CreateApplicationState = {
  success: boolean;
  applicationId: string | null;
  errors: unknown;
};

export async function createApplicationAction(
  prevState: CreateApplicationState,
  formData: FormData,
): Promise<CreateApplicationState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      applicationId: null,
      errors: {
        message: "User not authenticated",
      },
    };
  }

  const data = applicationSchema.safeParse({
    companyName: formData.get("companyName"),
    role: formData.get("role"),
    roleDescription: formData.get("roleDescription"),
    location: formData.get("location"),
    workMode: formData.get("workMode"),
    status: formData.get("status"),
    link: formData.get("link"),
    dateApplied: formData.get("dateApplied"),
  });

  if (!data.success) {
    return {
      success: false,
      applicationId: null,
      errors: z.treeifyError(data.error),
    };
  }

  try {
    const application = await db.application.create({
      data: {
        companyName: data.data.companyName,
        role: data.data.role,
        roleDescription: data.data.roleDescription,
        location: data.data.location,
        workMode: data.data.workMode,
        status: data.data.status,
        link: data.data.link,
        dateApplied: data.data.dateApplied,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    return {
      success: true,
      applicationId: application.id,
      errors: null,
    };
  } catch {
    return {
      success: false,
      applicationId: null,
      errors: {
        message:
          "Could not create the application. You may not have permission.",
      },
    };
  }
}
