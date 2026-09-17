import { auth } from "@/auth";

import { db } from "@/lib/db";

import Navbar from "@/components/navbar";
import ApplicationList from "@/components/application-list";
import DashboardHeader from "@/components/dashboard-header";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen">
        <Navbar />

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
        <DashboardHeader name={session.user.name} />

        <div className="mt-8">
          {/* <ApplicationStats applications={applications} /> */}
        </div>

        <section className="mt-10">
          <ApplicationList applications={applications} />
        </section>
      </main>
    </div>
  );
}
