"use client";

import { useState } from "react";
import type { Application } from "@/lib/generated/prisma/browser";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import EditApplicationDialog from "./edit-application-dialog";

interface ApplicationActionsProps {
  application: Application;
}

export default function ApplicationActions({
  application,
}: ApplicationActionsProps) {
  const [editOpen, setEditOpen] = useState(false);

  function handleDelete() {
    console.log("Delete application:", application.id);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Application actions"
            />
          }
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil />
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditApplicationDialog
        application={application}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
