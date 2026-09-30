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
      className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="min-w-0 rounded-xl border bg-card p-3 shadow-sm sm:p-5"
          >
            <div className="flex items-start justify-between gap-2 sm:gap-4">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {stat.value}
                </p>
              </div>

              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted sm:size-10">
                <Icon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground sm:size-5"
                />
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
