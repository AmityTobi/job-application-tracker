"use client";

import { useActionState, useEffect, useState } from "react";
import type { Application } from "@/lib/generated/prisma/browser";

import { updateApplicationAction } from "@/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface EditApplicationDialogProps {
  application: Application;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState = {
  success: false,
  errors: null,
};

function formatDateForInput(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function EditApplicationDialog({
  application,
  open,
  onOpenChange,
}: EditApplicationDialogProps) {
  const [state, formAction, isPending] = useActionState(
    updateApplicationAction,
    initialState,
  );

  const [companyName, setCompanyName] = useState(application.companyName);

  const [role, setRole] = useState(application.role);

  const [location, setLocation] = useState(application.location ?? "");

  const [workMode, setWorkMode] = useState(application.workMode ?? "");

  const [status, setStatus] = useState(application.status);

  const [dateApplied, setDateApplied] = useState(
    formatDateForInput(application.dateApplied),
  );

  const [link, setLink] = useState(application.link ?? "");

  const [roleDescription, setRoleDescription] = useState(
    application.roleDescription ?? "",
  );

  /*
   * Close the dialog after a successful update.
   */
  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
    }
  }, [state.success, onOpenChange]);

  /*
   * Reset the form to the saved application data
   * every time the dialog opens.
   *
   * This prevents unsaved edits from remaining
   * after the user cancels and reopens the dialog.
   */
  useEffect(() => {
    if (!open) return;

    setCompanyName(application.companyName);
    setRole(application.role);
    setLocation(application.location ?? "");
    setWorkMode(application.workMode ?? "");
    setStatus(application.status);
    setDateApplied(formatDateForInput(application.dateApplied));
    setLink(application.link ?? "");
    setRoleDescription(application.roleDescription ?? "");
  }, [open, application]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit application</DialogTitle>

          <DialogDescription>
            Update the details for your application at {application.companyName}
            .
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="id" value={application.id} />

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor={`companyName-${application.id}`}>Company</Label>

            <Input
              id={`companyName-${application.id}`}
              name="companyName"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              required
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor={`role-${application.id}`}>Role</Label>

            <Input
              id={`role-${application.id}`}
              name="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor={`location-${application.id}`}>Location</Label>

            <Input
              id={`location-${application.id}`}
              name="location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="e.g. Lagos, Nigeria"
            />
          </div>

          {/* Work mode + Status */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`workMode-${application.id}`}>Work mode</Label>

              <Select
                name="workMode"
                value={workMode}
                onValueChange={(value) => {
                  setWorkMode(value ?? "");
                }}
              >
                <SelectTrigger
                  id={`workMode-${application.id}`}
                  className="w-full"
                >
                  <SelectValue placeholder="Select work mode" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="REMOTE">Remote</SelectItem>

                  <SelectItem value="HYBRID">Hybrid</SelectItem>

                  <SelectItem value="ONSITE">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`status-${application.id}`}>Status</Label>

              <Select
                name="status"
                value={status}
                onValueChange={(value) => {
                  if (
                    value === "APPLIED" ||
                    value === "INTERVIEW" ||
                    value === "OFFER" ||
                    value === "REJECTED"
                  ) {
                    setStatus(value);
                  }
                }}
              >
                <SelectTrigger
                  id={`status-${application.id}`}
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="APPLIED">Applied</SelectItem>

                  <SelectItem value="INTERVIEW">Interview</SelectItem>

                  <SelectItem value="OFFER">Offer</SelectItem>

                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date applied */}
          <div className="space-y-2">
            <Label htmlFor={`dateApplied-${application.id}`}>
              Date applied
            </Label>

            <Input
              id={`dateApplied-${application.id}`}
              name="dateApplied"
              type="date"
              value={dateApplied}
              onChange={(event) => setDateApplied(event.target.value)}
              required
            />
          </div>

          {/* Job link */}
          <div className="space-y-2">
            <Label htmlFor={`link-${application.id}`}>Job link</Label>

            <Input
              id={`link-${application.id}`}
              name="link"
              type="url"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="https://company.com/jobs/..."
            />
          </div>

          {/* Role description */}
          <div className="space-y-2">
            <Label htmlFor={`roleDescription-${application.id}`}>
              Role description
            </Label>

            <Textarea
              id={`roleDescription-${application.id}`}
              name="roleDescription"
              value={roleDescription}
              onChange={(event) => setRoleDescription(event.target.value)}
              placeholder="Add a short description of the role..."
              className="min-h-28 resize-none"
            />
          </div>

          {/* Server error */}
          {state.errors &&
            "message" in state.errors &&
            typeof state.errors.message === "string" && (
              <p className="text-sm text-destructive">{state.errors.message}</p>
            )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
