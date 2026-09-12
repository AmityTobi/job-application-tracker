"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import z from "zod";

export async function deleteApplicationAction(
  prevState: unknown,
  formData: FormData,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      errors: { message: "Could not authenticate the user" },
    };
  }

  const schema = z.object({
    id: z.string(),
  });

  const data = schema.safeParse({
    id: formData.get("id"),
  });

  if (!data.success) {
    return {
      success: false,
      errors: { message: z.treeifyError(data.error) },
    };
  }

  try {
    await db.application.delete({
      where: { id: data.data.id, userId: session.user.id },
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
          "Could not delete the application. It may not exist or you may not have permission.",
      },
    };
  }
}
