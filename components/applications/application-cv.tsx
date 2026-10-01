"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Download,
  Eye,
  FileText,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";

import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  MAX_CV_SIZE,
  formatFileSize,
  validateCvFile,
} from "@/lib/applications/cv";

interface ApplicationCvProps {
  application: {
    id: string;
    cvFileName: string | null;
    cvSize: number | null;
    cvUploadedAt: Date | null;
  };
}

export default function ApplicationCv({ application }: ApplicationCvProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const isBusy = isUploading || isRemoving;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = validateCvFile(file);

    if (validationError) {
      toast.error("Invalid CV", {
        description: validationError,
      });

      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.set("cv", file);

      const response = await fetch(`/api/applications/${application.id}/cv`, {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "Could not upload the CV.");
      }

      toast.success(application.cvFileName ? "CV replaced" : "CV uploaded", {
        description: application.cvFileName
          ? "The CV for this application has been replaced."
          : "The CV has been attached to this application.",
      });

      router.refresh();
    } catch (error) {
      toast.error("Upload failed", {
        description:
          error instanceof Error
            ? error.message
            : "Could not upload the CV. Please try again.",
      });
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleRemove() {
    if (!application.cvFileName || isBusy) {
      return;
    }

    setIsRemoving(true);

    try {
      const response = await fetch(`/api/applications/${application.id}/cv`, {
        method: "DELETE",
      });

      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "Could not remove the CV.");
      }

      /*
       * Close the confirmation dialog before refreshing
       * the server-rendered application data.
       */
      setRemoveDialogOpen(false);

      toast.success("CV removed", {
        description: "The CV has been removed from this application.",
      });

      router.refresh();
    } catch (error) {
      toast.error("Removal failed", {
        description:
          error instanceof Error
            ? error.message
            : "Could not remove the CV. Please try again.",
      });
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <>
      <section
        aria-labelledby={`application-cv-${application.id}`}
        className="space-y-3 rounded-xl border bg-muted/20 p-4"
      >
        <div>
          <h3
            id={`application-cv-${application.id}`}
            className="text-sm font-medium"
          >
            CV used for this application
          </h3>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Attach the PDF CV you used when applying. Maximum file size:{" "}
            {formatFileSize(MAX_CV_SIZE)}.
          </p>
        </div>

        {application.cvFileName ? (
          <div className="space-y-3">
            <div className="flex min-w-0 items-start gap-3 rounded-lg border bg-background p-3">
              <div
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"
              >
                <FileText className="size-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-medium"
                  title={application.cvFileName}
                >
                  {application.cvFileName}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {application.cvSize !== null
                    ? formatFileSize(application.cvSize)
                    : "PDF document"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <Button
                nativeButton={false}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                render={
                  <a
                    href={`/api/applications/${application.id}/cv`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${application.cvFileName} in a new tab`}
                  />
                }
              >
                <Eye aria-hidden="true" />
                View
              </Button>

              <Button
                nativeButton={false}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                render={
                  <a
                    href={`/api/applications/${application.id}/cv?download=1`}
                    aria-label={`Download ${application.cvFileName}`}
                  />
                }
              >
                <Download aria-hidden="true" />
                Download
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isBusy}
                className="w-full sm:w-auto"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <LoaderCircle aria-hidden="true" className="animate-spin" />
                ) : (
                  <Upload aria-hidden="true" />
                )}

                {isUploading ? "Uploading..." : "Replace"}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isBusy}
                className="w-full text-destructive hover:text-destructive sm:w-auto"
                onClick={() => setRemoveDialogOpen(true)}
              >
                <Trash2 aria-hidden="true" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => fileInputRef.current?.click()}
            className="
              flex w-full items-center justify-center gap-2
              rounded-lg border border-dashed p-5
              text-sm font-medium
              transition-colors
              hover:bg-muted/50
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            {isUploading ? (
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin"
              />
            ) : (
              <Upload aria-hidden="true" className="size-4" />
            )}

            {isUploading ? "Uploading CV..." : "Attach PDF CV"}
          </button>
        )}

        <Label htmlFor={`cv-${application.id}`} className="sr-only">
          Choose PDF CV
        </Label>

        <input
          ref={fileInputRef}
          id={`cv-${application.id}`}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          disabled={isBusy}
          onChange={handleFileChange}
        />
      </section>

      <AlertDialog
        open={removeDialogOpen}
        onOpenChange={(open) => {
          if (!isRemoving) {
            setRemoveDialogOpen(open);
          }
        }}
      >
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-lg overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove CV?</AlertDialogTitle>

            <AlertDialogDescription className="wrap-break-word">
              This will remove{" "}
              <span className="font-medium text-foreground">
                {application.cvFileName}
              </span>{" "}
              from this application. You can attach another CV later.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              render={
                <Button type="button" variant="outline" disabled={isRemoving} />
              }
            >
              Cancel
            </AlertDialogCancel>

            <Button
              type="button"
              variant="destructive"
              disabled={isRemoving}
              aria-busy={isRemoving}
              onClick={handleRemove}
              className="min-w-32 gap-2"
            >
              {isRemoving && (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
              )}

              {isRemoving ? "Removing..." : "Remove CV"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
