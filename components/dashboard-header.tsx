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

      <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
        Keep track of your job search in one place.
      </p>
    </section>
  );
}
