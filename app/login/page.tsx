import { redirect } from "next/navigation";

import {
  AlertCircle,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  LayoutDashboard,
} from "lucide-react";

import { auth, signIn } from "@/auth";
import { getAuthError } from "@/lib/auth-errors";

import { Button } from "@/components/ui/button";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="size-5 shrink-0"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />

      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.28 5.48-4.81 7.18l7.73 6C44.37 38.03 46.98 31.88 46.98 24.55z"
      />

      <path
        fill="#FBBC05"
        d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"
      />

      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.92-2.13 15.89-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5 shrink-0"
    >
      <path d="M12 .297a12 12 0 0 0-3.793 23.386c.6.111.82-.261.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.333-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.301 1.23a11.52 11.52 0 0 1 6.006 0c2.291-1.553 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.221 0 4.61-2.806 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.216.694.825.576A12.001 12.001 0 0 0 12 .297Z" />
    </svg>
  );
}

function DashboardPreview() {
  const applications = [
    {
      company: "Linear",
      initial: "L",
      role: "Frontend Developer",
      status: "Interview",
      statusClass: "bg-blue-50 text-blue-700 ring-blue-200",
      iconClass: "bg-neutral-900 text-white",
    },
    {
      company: "Vercel",
      initial: "V",
      role: "Software Engineer",
      status: "Applied",
      statusClass: "bg-neutral-100 text-neutral-700 ring-neutral-200",
      iconClass: "bg-white text-neutral-900 ring-1 ring-neutral-200",
    },
    {
      company: "Notion",
      initial: "N",
      role: "Product Engineer",
      status: "Offer",
      statusClass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      iconClass: "bg-neutral-100 text-neutral-900",
    },
  ];

  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-xl">
      {/* Background decoration */}
      <div className="absolute -top-12 -left-12 size-64 rounded-full bg-orange-200/40 blur-3xl" />

      <div className="absolute -right-10 -bottom-10 size-64 rounded-full bg-amber-200/40 blur-3xl" />

      {/* Dashboard */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_24px_80px_-24px_rgba(0,0,0,0.18)]">
        {/* Preview navbar */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-orange-500 text-white">
              <BriefcaseBusiness className="size-4" />
            </div>

            <span className="text-sm font-bold tracking-tight text-neutral-900">
              JobTrack
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <LayoutDashboard className="size-3.5" />
            Dashboard
          </div>
        </div>

        <div className="space-y-6 p-5">
          {/* Dashboard heading */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-neutral-500">Your dashboard</p>

              <h3 className="mt-1 text-lg font-semibold tracking-tight text-neutral-900">
                Application overview
              </h3>
            </div>

            <div className="flex size-8 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-700">
              JD
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-neutral-200 p-3">
              <div className="flex items-center gap-1.5 text-neutral-500">
                <BriefcaseBusiness className="size-3.5" />

                <span className="text-[11px]">Applications</span>
              </div>

              <p className="mt-3 text-2xl font-bold text-neutral-900">24</p>
            </div>

            <div className="rounded-xl border border-neutral-200 p-3">
              <div className="flex items-center gap-1.5 text-neutral-500">
                <CalendarDays className="size-3.5" />

                <span className="text-[11px]">Interviews</span>
              </div>

              <p className="mt-3 text-2xl font-bold text-neutral-900">05</p>
            </div>

            <div className="rounded-xl border border-neutral-200 p-3">
              <div className="flex items-center gap-1.5 text-neutral-500">
                <CheckCircle2 className="size-3.5" />

                <span className="text-[11px]">Offers</span>
              </div>

              <p className="mt-3 text-2xl font-bold text-neutral-900">02</p>
            </div>
          </div>

          {/* Application list */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-neutral-900">
                Recent applications
              </h4>

              <span className="flex items-center gap-1 text-[11px] font-medium text-orange-700">
                View all
                <ArrowUpRight className="size-3" />
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-neutral-200">
              {applications.map((application, index) => (
                <div
                  key={application.company}
                  className={`flex items-center justify-between gap-3 p-3 ${
                    index !== applications.length - 1
                      ? "border-b border-neutral-100"
                      : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${application.iconClass}`}
                    >
                      {application.initial}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-neutral-900">
                        {application.role}
                      </p>

                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        {application.company}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ring-1 ring-inset ${application.statusClass}`}
                  >
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating progress card */}
      <div className="absolute -right-5 -bottom-7 hidden w-48 rounded-xl border border-neutral-200 bg-white p-4 shadow-xl xl:block">
        <div className="mb-3 flex items-center gap-2">
          <Clock3 className="size-4 text-orange-500" />

          <span className="text-xs font-semibold text-neutral-900">
            Stay organized
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-emerald-500" />

            <span className="text-[11px] text-neutral-600">
              Track applications
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-emerald-500" />

            <span className="text-[11px] text-neutral-600">
              Manage interviews
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Circle className="size-3.5 text-neutral-300" />

            <span className="text-[11px] text-neutral-600">
              Land your next role
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  const { error } = await searchParams;
  const authError = getAuthError(error);

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Authentication section */}
        <section className="flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-14">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BriefcaseBusiness className="size-5" />
            </div>

            <span className="text-xl font-bold tracking-tight">JobTrack</span>
          </div>

          {/* Authentication content */}
          <div className="flex flex-1 items-center justify-center py-16">
            <div className="w-full max-w-sm">
              <div className="mb-9">
                <div className="mb-5 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground">
                  Your job applications, organized
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Stay on top of every opportunity.
                </h1>

                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  Track applications, manage interviews, and keep your job
                  search organized in one simple dashboard.
                </p>
              </div>

              {/* Authentication error */}
              {authError && (
                <div
                  role="alert"
                  className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      aria-hidden="true"
                      className="mt-0.5 size-5 shrink-0 text-destructive"
                    />

                    <div className="space-y-2">
                      <h2 className="text-sm font-semibold">
                        {authError.title}
                      </h2>

                      <p className="text-sm leading-6 text-muted-foreground">
                        {authError.description}
                      </p>

                      {authError.suggestion && (
                        <p className="text-sm leading-6 text-muted-foreground">
                          {authError.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Authentication buttons */}
              <div className="space-y-3">
                <form
                  action={async () => {
                    "use server";

                    await signIn("google", {
                      redirectTo: "/",
                    });
                  }}
                >
                  <Button
                    type="submit"
                    variant="outline"
                    className="h-12 w-full gap-3 text-sm font-medium"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </Button>
                </form>

                <form
                  action={async () => {
                    "use server";

                    await signIn("github", {
                      redirectTo: "/",
                    });
                  }}
                >
                  <Button
                    type="submit"
                    variant="outline"
                    className="h-12 w-full gap-3 text-sm font-medium"
                  >
                    <GitHubIcon />
                    Continue with GitHub
                  </Button>
                </form>
              </div>

              <p className="mt-6 text-center text-xs leading-6 text-muted-foreground">
                New to JobTrack? Your account is created automatically when you
                continue.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground lg:text-left">
            © {new Date().getFullYear()} JobTrack. Keep every opportunity in
            sight.
          </p>
        </section>

        {/* Dashboard illustration */}
        <section className="relative hidden min-h-screen flex-col justify-center overflow-hidden border-l bg-[#FAF8F5] px-12 py-16 lg:flex xl:px-20">
          <div className="relative mx-auto w-full max-w-xl">
            <div className="mb-12">
              <span className="mb-4 inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700">
                A clearer way to stay organized
              </span>

              <h2 className="max-w-lg text-3xl font-bold leading-tight tracking-tight text-neutral-900 xl:text-4xl">
                Less tracking.
                <br />
                More progress.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-neutral-600">
                Everything you need to manage your applications and follow your
                progress, beautifully organized in one place.
              </p>
            </div>

            <DashboardPreview />
          </div>
        </section>
      </div>
    </main>
  );
}
