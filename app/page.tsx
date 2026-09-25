import { auth } from "@/auth";

import {
  parseApplicationSearchParams,
  type ApplicationSearchParams,
} from "@/lib/applications/search-params";

import { getApplications } from "@/lib/applications/queries";

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
  searchParams: Promise<ApplicationSearchParams>;
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

  // Validate the URL parameters.
  const { searchTerm, selectedStatus, selectedSort, pageNumber } =
    parseApplicationSearchParams(await searchParams);

  // Retrieve application data.
  const { applications, allApplications, totalPages, currentPage } =
    await getApplications({
      userId: session.user.id,
      searchTerm,
      selectedStatus,
      selectedSort,
      pageNumber,
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
