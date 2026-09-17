"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import z from "zod";

export interface DeleteApplicationState {
  success: boolean;
  errors: {
    message: string;
  } | null;
}

export async function deleteApplicationAction(
  prevState: DeleteApplicationState,
  formData: FormData,
): Promise<DeleteApplicationState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      errors: {
        message: "Could not authenticate the user",
      },
    };
  }

  const schema = z.object({
    id: z.string().min(1),
  });

  const data = schema.safeParse({
    id: formData.get("id"),
  });

  if (!data.success) {
    return {
      success: false,
      errors: {
        message: "Invalid application ID",
      },
    };
  }

  try {
    await db.application.delete({
      where: {
        id: data.data.id,
        userId: session.user.id,
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
          "Could not delete the application. It may not exist or you may not have permission.",
      },
    };
  }
}
