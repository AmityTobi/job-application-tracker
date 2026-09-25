import { auth } from "@/auth";
import { db } from "@/lib/db";

import type { Prisma } from "@/lib/generated/prisma/client";

import Navbar from "@/components/navbar";
import DashboardHeader from "@/components/dashboard-header";
import ApplicationList from "@/components/application-list";
import ApplicationStats from "@/components/applications/application-stats";

import AddApplicationDialog from "@/components/applications/add-application-dialog";
import ApplicationSearch from "@/components/applications/application-search";
import ApplicationStatusFilter from "@/components/applications/application-status-filter";
import ApplicationSort from "@/components/applications/application-sort";
import ApplicationPagination from "@/components/applications/application-pagination";

interface HomeProps {
  searchParams: Promise<{
    search?: string | string[];
    status?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  }>;
}

const PAGE_SIZE = 10;

const validStatuses = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;

const validSortOptions = [
  "newest",
  "oldest",
  "company-asc",
  "company-desc",
] as const;

type SortOption = (typeof validSortOptions)[number];

const sortOptions = {
  newest: [{ dateApplied: "desc" }, { id: "desc" }],
  oldest: [{ dateApplied: "asc" }, { id: "asc" }],
  "company-asc": [{ companyName: "asc" }, { id: "asc" }],
  "company-desc": [{ companyName: "desc" }, { id: "desc" }],
} satisfies Record<SortOption, Prisma.ApplicationOrderByWithRelationInput[]>;

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

  // Read URL parameters.
  const { search, status, sort, page } = await searchParams;

  // Normalize free-text search.
  const searchTerm =
    typeof search === "string" ? search.trim().slice(0, 100) : "";

  // Validate status.
  const selectedStatus = validStatuses.find((value) => value === status);

  // Validate sorting.
  const selectedSort: SortOption =
    validSortOptions.find((option) => option === sort) ?? "newest";

  // Validate pagination.
  const pageNumber =
    typeof page === "string" &&
    /^[1-9]\d*$/.test(page) &&
    Number.isSafeInteger(Number(page))
      ? Number(page)
      : 1;

  // Shared conditions for the filtered list and matching count.
  const where: Prisma.ApplicationWhereInput = {
    userId: session.user.id,

    ...(searchTerm && {
      OR: [
        {
          companyName: {
            contains: searchTerm,
          },
        },
        {
          role: {
            contains: searchTerm,
          },
        },
      ],
    }),

    ...(selectedStatus && {
      status: selectedStatus,
    }),
  };

  // Fetch all applications for stats and count matching applications.
  const [allApplications, totalApplications] = await Promise.all([
    db.application.findMany({
      where: {
        userId: session.user.id,
      },
    }),

    db.application.count({
      where,
    }),
  ]);

  // Calculate pagination.
  const totalPages = Math.max(1, Math.ceil(totalApplications / PAGE_SIZE));

  const currentPage = Math.min(pageNumber, totalPages);

  // Fetch only the applications required for the current page.
  const applications = await db.application.findMany({
    where,
    orderBy: sortOptions[selectedSort],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

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
            <ApplicationSearch key={searchTerm} defaultValue={searchTerm} />

            <div className="flex flex-col gap-3 sm:flex-row">
              <ApplicationStatusFilter value={selectedStatus ?? "ALL"} />

              <ApplicationSort value={selectedSort} />
            </div>
          </div>

          <ApplicationList
            applications={applications}
            hasActiveFilters={Boolean(searchTerm) || Boolean(selectedStatus)}
          />

          <ApplicationPagination
            currentPage={currentPage}
            totalPages={totalPages}
            searchParams={{
              search: searchTerm,
              status: selectedStatus,
              sort: selectedSort,
            }}
          />
        </section>
      </main>
    </div>
  );
}
