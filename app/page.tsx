import { auth } from "@/auth";
import { db } from "@/lib/db";

import Navbar from "@/components/navbar";
import DashboardHeader from "@/components/dashboard-header";
import ApplicationList from "@/components/application-list";
import AddApplicationDialog from "@/components/applications/add-application-dialog";

export default async function Home() {
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

  const applications = await db.application.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      dateApplied: "desc",
    },
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Dashboard heading */}
        <DashboardHeader name={session.user.name} />

        {/* Stats will go here later */}
        {/*
        <div className="mt-8">
          <ApplicationStats applications={applications} />
        </div>
        */}

        {/* Applications */}
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

          <ApplicationList applications={applications} />
        </section>
      </main>
    </div>
  );
}
