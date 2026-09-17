interface DashboardHeaderProps {
  name?: string | null;
}

export default function DashboardHeader({ name }: DashboardHeaderProps) {
  const firstName = name?.split(" ")[0];

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Welcome back{firstName ? `, ${firstName}` : ""}
      </h1>

      <p className="mt-1 text-sm text-muted-foreground sm:text-base">
        Here&apos;s what&apos;s happening with your job search.
      </p>
    </section>
  );
}
