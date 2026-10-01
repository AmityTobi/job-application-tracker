"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ApplicationForm from "./application-form";

export default function AddApplicationDialog() {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function handleSuccess() {
    setOpen(false);

    setFormKey((current) => current + 1);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm">
            <Plus aria-hidden="true" className="size-4" />

            <span className="hidden sm:inline">Add Application</span>

            <span className="sm:hidden">Add</span>
          </Button>
        }
      />

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
          <DialogTitle>Add application</DialogTitle>

          <DialogDescription>
            Add a new opportunity to your job tracker.
          </DialogDescription>
        </DialogHeader>

        <ApplicationForm key={formKey} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
