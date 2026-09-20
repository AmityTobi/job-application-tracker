"use client";

import { useActionState, useEffect } from "react";

import { createApplicationAction } from "@/actions";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
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

interface ApplicationFormProps {
  onSuccess?: () => void;
}

const initialState = {
  success: false,
  errors: null,
};

export default function ApplicationForm({ onSuccess }: ApplicationFormProps) {
  const [state, formAction, isPending] = useActionState(
    createApplicationAction,
    initialState,
  );

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-5">
      {/* Company */}
      <div className="space-y-2">
        <Label htmlFor="companyName">Company</Label>

        <Input
          id="companyName"
          name="companyName"
          placeholder="e.g. Stripe"
          required
        />
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>

        <Input
          id="role"
          name="role"
          placeholder="e.g. Frontend Developer"
          required
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>

        <Input
          id="location"
          name="location"
          placeholder="e.g. Lagos, Nigeria"
        />
      </div>

      {/* Work mode + Status */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="workMode">Work mode</Label>

          <Select name="workMode">
            <SelectTrigger id="workMode" className="w-full">
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
          <Label htmlFor="status">Status</Label>

          <Select name="status" defaultValue="APPLIED">
            <SelectTrigger id="status" className="w-full">
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
        <Label htmlFor="dateApplied">Date applied</Label>

        <Input
          id="dateApplied"
          name="dateApplied"
          type="date"
          defaultValue={today}
          required
        />
      </div>

      {/* Job link */}
      <div className="space-y-2">
        <Label htmlFor="link">Job link</Label>

        <Input
          id="link"
          name="link"
          type="url"
          placeholder="https://company.com/jobs/..."
        />
      </div>

      {/* Role description */}
      <div className="space-y-2">
        <Label htmlFor="roleDescription">Role description</Label>

        <Textarea
          id="roleDescription"
          name="roleDescription"
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
        <DialogClose
          render={
            <Button type="button" variant="outline" disabled={isPending} />
          }
        >
          Cancel
        </DialogClose>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add application"}
        </Button>
      </DialogFooter>
    </form>
  );
}
