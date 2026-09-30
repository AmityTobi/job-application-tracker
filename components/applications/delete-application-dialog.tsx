"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import type { Application } from "@/lib/generated/prisma/browser";

import { deleteApplicationAction } from "@/actions";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteApplicationDialogProps {
  application: Application;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteApplicationDialog({
  application,
  open,
  onOpenChange,
}: DeleteApplicationDialogProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (isPending) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const formData = new FormData();

      formData.set("id", application.id);

      try {
        const result = await deleteApplicationAction(
          {
            success: false,
            errors: null,
          },
          formData,
        );

        if (!result.success) {
          const message =
            result.errors?.message ?? "Unable to delete the application.";

          setError(message);

          toast.error("Deletion failed", {
            description: message,
          });

          return;
        }

        // Close the dialog first.
        onOpenChange(false);

        // Then show the success notification.
        toast.success("Application deleted", {
          description: "The application has been removed successfully.",
        });

        // Refresh server-rendered application data.
        router.refresh();
      } catch {
        const message = "Something went wrong. Please try again.";

        setError(message);

        toast.error("Something went wrong", {
          description: message,
        });
      }
    });
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) {
          onOpenChange(nextOpen);

          if (!nextOpen) {
            setError(null);
          }
        }
      }}
    >
      <AlertDialogContent className="w-[calc(100%-2rem)] max-w-lg overflow-hidden">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete application?</AlertDialogTitle>

          <AlertDialogDescription className="wrap-break-word">
            This will permanently remove your{" "}
            <span className="font-medium text-foreground">
              {application.role}
            </span>{" "}
            application at{" "}
            <span className="font-medium text-foreground">
              {application.companyName}
            </span>
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p role="alert" className="wrap-break-word text-sm text-destructive">
            {error}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            render={
              <Button type="button" variant="outline" disabled={isPending} />
            }
          >
            Cancel
          </AlertDialogCancel>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            aria-busy={isPending}
            className="min-w-32 gap-2"
          >
            {isPending && (
              <LoaderCircle
                className="size-4 shrink-0 animate-spin"
                aria-hidden="true"
              />
            )}

            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
