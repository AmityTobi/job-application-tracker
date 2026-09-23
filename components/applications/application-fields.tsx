"use client";

import type {
  ApplicationStatus,
  WorkMode,
} from "@/lib/generated/prisma/browser";

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

export interface ApplicationFormValues {
  companyName: string;
  role: string;
  location: string;
  workMode: WorkMode | "";
  status: ApplicationStatus;
  dateApplied: string;
  link: string;
  roleDescription: string;
}

interface ApplicationFieldsProps {
  values: ApplicationFormValues;
  onChange: (values: ApplicationFormValues) => void;
}

export default function ApplicationFields({
  values,
  onChange,
}: ApplicationFieldsProps) {
  function updateField<K extends keyof ApplicationFormValues>(
    field: K,
    value: ApplicationFormValues[K],
  ) {
    onChange({
      ...values,
      [field]: value,
    });
  }

  return (
    <>
      {/* Company */}
      <div className="space-y-2">
        <Label htmlFor="companyName">Company</Label>

        <Input
          id="companyName"
          name="companyName"
          value={values.companyName}
          onChange={(event) => updateField("companyName", event.target.value)}
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
          value={values.role}
          onChange={(event) => updateField("role", event.target.value)}
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
          value={values.location}
          onChange={(event) => updateField("location", event.target.value)}
          placeholder="e.g. Lagos, Nigeria"
        />
      </div>

      {/* Work mode + Status */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="workMode">Work mode</Label>

          <Select
            name="workMode"
            value={values.workMode}
            onValueChange={(value) => {
              if (
                value === "REMOTE" ||
                value === "HYBRID" ||
                value === "ONSITE"
              ) {
                updateField("workMode", value);
              }
            }}
          >
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

          <Select
            name="status"
            value={values.status}
            onValueChange={(value) => {
              if (
                value === "APPLIED" ||
                value === "INTERVIEW" ||
                value === "OFFER" ||
                value === "REJECTED"
              ) {
                updateField("status", value);
              }
            }}
          >
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
          value={values.dateApplied}
          onChange={(event) => updateField("dateApplied", event.target.value)}
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
          value={values.link}
          onChange={(event) => updateField("link", event.target.value)}
          placeholder="https://company.com/jobs/..."
        />
      </div>

      {/* Role description */}
      <div className="space-y-2">
        <Label htmlFor="roleDescription">Role description</Label>

        <Textarea
          id="roleDescription"
          name="roleDescription"
          value={values.roleDescription}
          onChange={(event) =>
            updateField("roleDescription", event.target.value)
          }
          placeholder="Add a short description of the role..."
          className="min-h-28 resize-none"
        />
      </div>
    </>
  );
}
