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

export type ApplicationFieldErrors = Partial<
  Record<keyof ApplicationFormValues, string>
>;

interface ApplicationFieldsProps {
  values: ApplicationFormValues;

  onChange: (values: ApplicationFormValues) => void;

  errors?: ApplicationFieldErrors;

  onClearError?: (field: keyof ApplicationFormValues) => void;
}

export default function ApplicationFields({
  values,
  onChange,
  errors = {},
  onClearError,
}: ApplicationFieldsProps) {
  function updateField<K extends keyof ApplicationFormValues>(
    field: K,
    value: ApplicationFormValues[K],
  ) {
    onChange({
      ...values,
      [field]: value,
    });

    onClearError?.(field);
  }

  return (
    <>
      {/* Company */}

      <div className="space-y-2">
        <Label htmlFor="companyName">
          Company
          <span aria-hidden="true" className="ml-1 text-destructive">
            *
          </span>
        </Label>

        <Input
          id="companyName"
          name="companyName"
          value={values.companyName}
          onChange={(event) => updateField("companyName", event.target.value)}
          placeholder="e.g. Stripe"
          aria-required="true"
          aria-invalid={Boolean(errors.companyName)}
          aria-describedby={
            errors.companyName ? "companyName-error" : undefined
          }
        />

        {errors.companyName && (
          <p
            id="companyName-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.companyName}
          </p>
        )}
      </div>

      {/* Role */}

      <div className="space-y-2">
        <Label htmlFor="role">
          Role
          <span aria-hidden="true" className="ml-1 text-destructive">
            *
          </span>
        </Label>

        <Input
          id="role"
          name="role"
          value={values.role}
          onChange={(event) => updateField("role", event.target.value)}
          placeholder="e.g. Frontend Developer"
          aria-required="true"
          aria-invalid={Boolean(errors.role)}
          aria-describedby={errors.role ? "role-error" : undefined}
        />

        {errors.role && (
          <p id="role-error" role="alert" className="text-sm text-destructive">
            {errors.role}
          </p>
        )}
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
          aria-invalid={Boolean(errors.location)}
          aria-describedby={errors.location ? "location-error" : undefined}
        />

        {errors.location && (
          <p
            id="location-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.location}
          </p>
        )}
      </div>

      {/* Work mode and status */}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Work mode */}

        <div className="space-y-2">
          <Label htmlFor="workMode">Work mode</Label>

          <Select
            name="workMode"
            value={values.workMode || null}
            onValueChange={(value) => {
              if (
                value === "REMOTE" ||
                value === "HYBRID" ||
                value === "ONSITE"
              ) {
                updateField("workMode", value);
              } else if (value === null) {
                updateField("workMode", "");
              }
            }}
          >
            <SelectTrigger
              id="workMode"
              className="w-full"
              aria-invalid={Boolean(errors.workMode)}
              aria-describedby={errors.workMode ? "workMode-error" : undefined}
            >
              <SelectValue placeholder="Select work mode" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="REMOTE">Remote</SelectItem>
              <SelectItem value="HYBRID">Hybrid</SelectItem>
              <SelectItem value="ONSITE">On-site</SelectItem>
            </SelectContent>
          </Select>

          {errors.workMode && (
            <p
              id="workMode-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.workMode}
            </p>
          )}
        </div>

        {/* Status */}

        <div className="space-y-2">
          <Label htmlFor="status">
            Status
            <span aria-hidden="true" className="ml-1 text-destructive">
              *
            </span>
          </Label>

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
            <SelectTrigger
              id="status"
              className="w-full"
              aria-required="true"
              aria-invalid={Boolean(errors.status)}
              aria-describedby={errors.status ? "status-error" : undefined}
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="INTERVIEW">Interview</SelectItem>
              <SelectItem value="OFFER">Offer</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {errors.status && (
            <p
              id="status-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.status}
            </p>
          )}
        </div>
      </div>

      {/* Date applied */}

      <div className="space-y-2">
        <Label htmlFor="dateApplied">
          Date applied
          <span aria-hidden="true" className="ml-1 text-destructive">
            *
          </span>
        </Label>

        <Input
          id="dateApplied"
          name="dateApplied"
          type="date"
          value={values.dateApplied}
          onChange={(event) => updateField("dateApplied", event.target.value)}
          aria-required="true"
          aria-invalid={Boolean(errors.dateApplied)}
          aria-describedby={
            errors.dateApplied ? "dateApplied-error" : undefined
          }
        />

        {errors.dateApplied && (
          <p
            id="dateApplied-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.dateApplied}
          </p>
        )}
      </div>

      {/* Job link */}

      <div className="space-y-2">
        <Label htmlFor="link">Job link</Label>

        <Input
          id="link"
          name="link"
          type="url"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          value={values.link}
          onChange={(event) => updateField("link", event.target.value)}
          placeholder="https://company.com/jobs/..."
          aria-invalid={Boolean(errors.link)}
          aria-describedby={errors.link ? "link-error" : undefined}
        />

        {errors.link && (
          <p id="link-error" role="alert" className="text-sm text-destructive">
            {errors.link}
          </p>
        )}
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
          aria-invalid={Boolean(errors.roleDescription)}
          aria-describedby={
            errors.roleDescription ? "roleDescription-error" : undefined
          }
        />

        {errors.roleDescription && (
          <p
            id="roleDescription-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.roleDescription}
          </p>
        )}
      </div>
    </>
  );
}
