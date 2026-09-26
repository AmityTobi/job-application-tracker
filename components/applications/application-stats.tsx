import {
  BriefcaseBusiness,
  CalendarCheck,
  CircleCheckBig,
  CircleX,
} from "lucide-react";

interface ApplicationStatsProps {
  stats: {
    total: number;
    interviews: number;
    offers: number;
    rejected: number;
  };
}

export default function ApplicationStats({
  stats: applicationStats,
}: ApplicationStatsProps) {
  const stats = [
    {
      label: "Applications",
      value: applicationStats.total,
      description: "Total tracked",
      icon: BriefcaseBusiness,
    },
    {
      label: "Interviews",
      value: applicationStats.interviews,
      description: "In progress",
      icon: CalendarCheck,
    },
    {
      label: "Offers",
      value: applicationStats.offers,
      description: "Received",
      icon: CircleCheckBig,
    },
    {
      label: "Rejected",
      value: applicationStats.rejected,
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
