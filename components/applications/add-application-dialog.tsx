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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm">
            <Plus />
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add application</DialogTitle>

          <DialogDescription>
            Add a new opportunity to your job tracker.
          </DialogDescription>
        </DialogHeader>

        <ApplicationForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
