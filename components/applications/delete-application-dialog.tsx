"use client";

import { useActionState, useEffect } from "react";
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

const initialState = {
  success: false,
  errors: null,
};

export default function DeleteApplicationDialog({
  application,
  open,
  onOpenChange,
}: DeleteApplicationDialogProps) {
  const [state, formAction, isPending] = useActionState(
    deleteApplicationAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
    }
  }, [state.success, onOpenChange]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete application?</AlertDialogTitle>

          <AlertDialogDescription>
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

        {state.errors &&
          "message" in state.errors &&
          typeof state.errors.message === "string" && (
            <p className="text-sm text-destructive">{state.errors.message}</p>
          )}

        <form action={formAction}>
          <input type="hidden" name="id" value={application.id} />

          <AlertDialogFooter>
            <AlertDialogCancel
              render={
                <Button type="button" variant="outline" disabled={isPending} />
              }
            >
              Cancel
            </AlertDialogCancel>

            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
