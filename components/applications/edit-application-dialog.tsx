"use client";

import type { Application } from "@/lib/generated/prisma/browser";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ApplicationCv from "./application-cv";
import EditApplicationForm from "./edit-application-form";

interface EditApplicationDialogProps {
  application: Application;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditApplicationDialog({
  application,
  open,
  onOpenChange,
}: EditApplicationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-h-[calc(100dvh-2rem)]
          w-[calc(100%-2rem)]
          overflow-x-hidden
          overflow-y-auto
          overscroll-contain
          sm:max-w-lg
        "
      >
        <DialogHeader>
          <DialogTitle>Edit application</DialogTitle>

          <DialogDescription className="wrap-break-word">
            Update the details for your application at {application.companyName}
            .
          </DialogDescription>
        </DialogHeader>

        <EditApplicationForm
          application={application}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />

        <div className="border-t pt-5">
          <ApplicationCv application={application} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
