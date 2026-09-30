import Link from "next/link";

import { BriefcaseBusiness, LogOut } from "lucide-react";

import { auth } from "@/auth";
import * as actions from "@/actions";

import { Button } from "@/components/ui/button";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}

        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
            <BriefcaseBusiness className="size-5" aria-hidden="true" />
          </div>

          <span className="text-lg font-semibold tracking-tight">JobTrack</span>
        </Link>

        {/* Authentication */}

        {session?.user ? (
          <form action={actions.logoutAction}>
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="size-4" aria-hidden="true" />

              <span>Sign out</span>
            </Button>
          </form>
        ) : (
          <Button
            nativeButton={false}
            render={<Link href="/login" />}
            variant="outline"
            size="sm"
          >
            Sign in
          </Button>
        )}
      </nav>
    </header>
  );
}
