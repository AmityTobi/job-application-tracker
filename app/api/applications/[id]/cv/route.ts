import { del, get, put } from "@vercel/blob";

import { auth } from "@/auth";
import { db } from "@/lib/db";

import {
  createContentDisposition,
  createCvPathname,
  hasPdfSignature,
  validateCvFile,
} from "@/lib/applications/cv";

interface CvRouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: Request, context: CvRouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json(
      {
        error: "You must be signed in to upload a CV.",
      },
      {
        status: 401,
      },
    );
  }

  const { id } = await context.params;

  const application = await db.application.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    select: {
      id: true,
      cvPathname: true,
    },
  });

  if (!application) {
    return Response.json(
      {
        error: "Application not found.",
      },
      {
        status: 404,
      },
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      {
        error: "Unable to read the uploaded file.",
      },
      {
        status: 400,
      },
    );
  }

  const cv = formData.get("cv");

  if (!(cv instanceof File)) {
    return Response.json(
      {
        error: "Please select a PDF CV.",
      },
      {
        status: 400,
      },
    );
  }

  const validationError = validateCvFile(cv);

  if (validationError) {
    return Response.json(
      {
        error: validationError,
      },
      {
        status: 400,
      },
    );
  }

  if (!(await hasPdfSignature(cv))) {
    return Response.json(
      {
        error: "The selected file does not appear to be a valid PDF.",
      },
      {
        status: 400,
      },
    );
  }

  const pathname = createCvPathname({
    userId: session.user.id,
    applicationId: application.id,
  });

  let uploadedPathname: string | null = null;

  try {
    const blob = await put(pathname, cv, {
      access: "private",
      contentType: "application/pdf",
      addRandomSuffix: false,
    });

    uploadedPathname = blob.pathname;

    await db.application.update({
      where: {
        id: application.id,
        userId: session.user.id,
      },
      data: {
        cvFileName: cv.name,
        cvPathname: blob.pathname,
        cvSize: cv.size,
        cvUploadedAt: new Date(),
      },
    });

    /*
     * Delete the previous CV only after the new upload and
     * database update have both succeeded.
     *
     * That prevents a failed replacement from destroying the
     * user's existing CV.
     */
    if (application.cvPathname && application.cvPathname !== blob.pathname) {
      try {
        await del(application.cvPathname);
      } catch (error) {
        console.error("Unable to delete replaced CV:", error);
      }
    }

    return Response.json({
      success: true,
      cv: {
        fileName: cv.name,
        size: cv.size,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    /*
     * If Blob succeeded but the database update failed,
     * remove the newly uploaded orphaned file.
     */
    if (uploadedPathname) {
      try {
        await del(uploadedPathname);
      } catch (cleanupError) {
        console.error("Unable to clean up failed CV upload:", cleanupError);
      }
    }

    console.error("Unable to upload CV:", error);

    return Response.json(
      {
        error: "Could not upload the CV. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: Request, context: CvRouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json(
      {
        error: "You must be signed in to access this CV.",
      },
      {
        status: 401,
      },
    );
  }

  const { id } = await context.params;

  const application = await db.application.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    select: {
      cvFileName: true,
      cvPathname: true,
    },
  });

  if (!application?.cvPathname || !application.cvFileName) {
    return Response.json(
      {
        error: "CV not found.",
      },
      {
        status: 404,
      },
    );
  }

  try {
    const result = await get(application.cvPathname, {
      access: "private",
    });

    if (!result) {
      return Response.json(
        {
          error: "CV not found.",
        },
        {
          status: 404,
        },
      );
    }

    const url = new URL(request.url);
    const shouldDownload = url.searchParams.get("download") === "1";

    return new Response(result.stream, {
      headers: {
        "Content-Type": "application/pdf",

        "Content-Disposition": createContentDisposition(
          application.cvFileName,
          shouldDownload,
        ),

        "X-Content-Type-Options": "nosniff",

        /*
         * CVs are private user documents, so don't let the
         * browser or intermediary caches retain them.
         */
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Unable to retrieve CV:", error);

    return Response.json(
      {
        error: "Could not retrieve the CV.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(_request: Request, context: CvRouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json(
      {
        error: "You must be signed in to remove a CV.",
      },
      {
        status: 401,
      },
    );
  }

  const { id } = await context.params;

  const application = await db.application.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    select: {
      id: true,
      cvPathname: true,
    },
  });

  if (!application) {
    return Response.json(
      {
        error: "Application not found.",
      },
      {
        status: 404,
      },
    );
  }

  if (!application.cvPathname) {
    return Response.json({
      success: true,
    });
  }

  const pathname = application.cvPathname;

  try {
    /*
     * Remove the database reference first.
     *
     * If Blob deletion later fails, the CV is no longer
     * accessible through JobTrack and can be cleaned up
     * separately.
     */
    await db.application.update({
      where: {
        id: application.id,
        userId: session.user.id,
      },
      data: {
        cvFileName: null,
        cvPathname: null,
        cvSize: null,
        cvUploadedAt: null,
      },
    });

    try {
      await del(pathname);
    } catch (error) {
      console.error("Unable to delete CV from Blob:", error);
    }

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error("Unable to remove CV:", error);

    return Response.json(
      {
        error: "Could not remove the CV. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
