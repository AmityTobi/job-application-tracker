import { auth } from "@/auth";
import { db } from "@/lib/db";

import Navbar from "@/components/navbar";
import DashboardHeader from "@/components/dashboard-header";
import ApplicationList from "@/components/application-list";
import AddApplicationDialog from "@/components/applications/add-application-dialog";
import ApplicationStats from "@/components/applications/application-stats";
import ApplicationSearch from "@/components/applications/application-search";
import ApplicationStatusFilter from "@/components/applications/application-status-filter";
import ApplicationSort from "@/components/applications/application-sort";

interface HomeProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sort?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen">
        <Navbar />

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <p className="text-muted-foreground">
            Please sign in to view your applications.
          </p>
        </main>
      </div>
    );
  }

  const { search, status, sort } = await searchParams;

  const validStatuses = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;

  const selectedStatus = validStatuses.find((value) => value === status);

  const validSortOptions = [
    "newest",
    "oldest",
    "company-asc",
    "company-desc",
  ] as const;

  type SortOption = (typeof validSortOptions)[number];

  const selectedSort: SortOption =
    validSortOptions.find((option) => option === sort) ?? "newest";

  const sortOptions = {
    newest: {
      dateApplied: "desc",
    },
    oldest: {
      dateApplied: "asc",
    },
    "company-asc": {
      companyName: "asc",
    },
    "company-desc": {
      companyName: "desc",
    },
  } as const;

  const [allApplications, applications] = await Promise.all([
    db.application.findMany({
      where: {
        userId: session.user.id,
      },
    }),

    db.application.findMany({
      where: {
        userId: session.user.id,

        ...(search && {
          OR: [
            {
              companyName: {
                contains: search,
              },
            },
            {
              role: {
                contains: search,
              },
            },
          ],
        }),

        ...(selectedStatus && {
          status: selectedStatus,
        }),
      },

      orderBy: sortOptions[selectedSort],
    }),
  ]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <DashboardHeader name={session.user.name} />

        <ApplicationStats applications={allApplications} />

        <section className="mt-10">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Applications
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Track and manage your job applications.
              </p>
            </div>

            <AddApplicationDialog />
          </div>

          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <ApplicationSearch key={search ?? ""} defaultValue={search ?? ""} />

            <div className="flex flex-col gap-3 sm:flex-row">
              <ApplicationStatusFilter value={selectedStatus ?? "ALL"} />

              <ApplicationSort value={selectedSort} />
            </div>
          </div>

          <ApplicationList
            applications={applications}
            hasActiveFilters={Boolean(search) || Boolean(selectedStatus)}
          />
        </section>
      </main>
    </div>
  );
}
