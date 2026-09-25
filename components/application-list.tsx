import type { Application } from "@/lib/generated/prisma/browser";

import { BriefcaseBusiness } from "lucide-react";

import AddApplicationDialog from "@/components/applications/add-application-dialog";
import ApplicationCard from "@/components/applications/application-card";

interface ApplicationListProps {
  applications: Application[];
  hasActiveFilters?: boolean;
}

export default function ApplicationList({
  applications,
  hasActiveFilters = false,
}: ApplicationListProps) {
  if (applications.length === 0 && hasActiveFilters) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <BriefcaseBusiness className="size-5 text-muted-foreground" />
        </div>

        <h3 className="mt-4 font-semibold tracking-tight">
          No matching applications
        </h3>

        <p className="mt-1.5 max-w-sm text-sm leading-6 text-muted-foreground">
          Try changing your search or status filter.
        </p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <BriefcaseBusiness className="size-5 text-muted-foreground" />
        </div>

        <h3 className="mt-4 font-semibold tracking-tight">
          No applications yet
        </h3>

        <p className="mt-1.5 max-w-sm text-sm leading-6 text-muted-foreground">
          Add your first application to start tracking your job search.
        </p>

        <div className="mt-5">
          <AddApplicationDialog />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  );
}
