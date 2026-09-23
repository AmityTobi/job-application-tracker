import type { Application } from "@/lib/generated/prisma/browser";

import {
  BriefcaseBusiness,
  CalendarCheck,
  CircleCheckBig,
  CircleX,
} from "lucide-react";

interface ApplicationStatsProps {
  applications: Application[];
}

export default function ApplicationStats({
  applications,
}: ApplicationStatsProps) {
  const totalApplications = applications.length;

  const interviews = applications.filter(
    (application) => application.status === "INTERVIEW",
  ).length;

  const offers = applications.filter(
    (application) => application.status === "OFFER",
  ).length;

  const rejected = applications.filter(
    (application) => application.status === "REJECTED",
  ).length;

  const stats = [
    {
      label: "Applications",
      value: totalApplications,
      description: "Total tracked",
      icon: BriefcaseBusiness,
    },
    {
      label: "Interviews",
      value: interviews,
      description: "In progress",
      icon: CalendarCheck,
    },
    {
      label: "Offers",
      value: offers,
      description: "Received",
      icon: CircleCheckBig,
    },
    {
      label: "Rejected",
      value: rejected,
      description: "Not selected",
      icon: CircleX,
    },
  ];

  return (
    <section
      aria-label="Application statistics"
      className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>
              </div>

              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-5 text-muted-foreground" />
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {stat.description}
            </p>
          </div>
        );
      })}
    </section>
  );
}
