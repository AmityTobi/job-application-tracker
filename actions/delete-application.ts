"use server";

import { del } from "@vercel/blob";
import z from "zod";

import { auth } from "@/auth";
import { db } from "@/lib/db";

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
    /*
     * Read the CV pathname before deleting the application.
     * Once the database row is gone, we would otherwise lose
     * the reference needed to clean up Blob storage.
     */
    const application = await db.application.findFirst({
      where: {
        id: data.data.id,
        userId: session.user.id,
      },
      select: {
        id: true,
        cvPathname: true,
      },
    });

    if (!application) {
      return {
        success: false,
        errors: {
          message:
            "Could not delete the application. It may not exist or you may not have permission.",
        },
      };
    }

    /*
     * Delete the database record first.
     *
     * This keeps the user's application deletion successful
     * even if external Blob cleanup temporarily fails.
     */
    await db.application.delete({
      where: {
        id: application.id,
        userId: session.user.id,
      },
    });

    /*
     * Best-effort cleanup of the private CV.
     *
     * A Blob failure should not recreate or preserve an
     * application the user explicitly deleted.
     */
    if (application.cvPathname) {
      try {
        await del(application.cvPathname);
      } catch (error) {
        console.error("Unable to delete application CV from Blob:", error);
      }
    }

    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    console.error("Unable to delete application:", error);

    return {
      success: false,
      errors: {
        message:
          "Could not delete the application. It may not exist or you may not have permission.",
      },
    };
  }
}
