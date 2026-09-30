import type { Application } from "@/lib/generated/prisma/browser";

import {
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  MapPin,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ApplicationActions from "@/components/applications/application-actions";

interface ApplicationCardProps {
  application: Application;
}

const statusStyles = {
  APPLIED:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  INTERVIEW:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  OFFER:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
  REJECTED:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
};

const statusLabels = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

const workModeLabels = {
  ONSITE: "On-site",
  HYBRID: "Hybrid",
  REMOTE: "Remote",
};

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(application.dateApplied);

  return (
    <article className="min-w-0 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      {/* Role, company and status */}
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap sm:gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="wrap-break-word text-base font-semibold tracking-tight sm:text-lg">
            {application.role}
          </h3>

          <p className="mt-1 wrap-break-word text-sm font-medium text-muted-foreground">
            {application.companyName}
          </p>
        </div>

        <Badge
          variant="outline"
          className={`shrink-0 ${statusStyles[application.status]}`}
        >
          {statusLabels[application.status]}
        </Badge>
      </div>

      {/* Application metadata */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        {application.location && (
          <div className="flex min-w-0 items-center gap-1.5">
            <MapPin aria-hidden="true" className="size-4 shrink-0" />

            <span className="wrap-break-word min-w-0">
              {application.location}
            </span>
          </div>
        )}

        {application.workMode && (
          <div className="flex items-center gap-1.5">
            <BriefcaseBusiness aria-hidden="true" className="size-4 shrink-0" />

            <span>{workModeLabels[application.workMode]}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <CalendarDays aria-hidden="true" className="size-4 shrink-0" />

          <span>Applied {formattedDate}</span>
        </div>
      </div>

      {/* Description */}
      {application.roleDescription && (
        <p className="mt-4 max-w-3xl wrap-break-word whitespace-pre-line text-sm leading-6 text-muted-foreground">
          {application.roleDescription}
        </p>
      )}

      {/* Actions */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <div>
          {application.link && (
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={
                <a
                  href={application.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View job posting for ${application.role} at ${application.companyName} (opens in a new tab)`}
                />
              }
            >
              <ExternalLink aria-hidden="true" className="size-4" />
              View job
            </Button>
          )}
        </div>

        <ApplicationActions application={application} />
      </div>
    </article>
  );
}
