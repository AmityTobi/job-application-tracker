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
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
            <BriefcaseBusiness className="size-5" />
          </div>

          <span className="hidden text-lg font-semibold tracking-tight sm:inline">
            JobTrack
          </span>
        </div>

        {/* Authentication action */}
        {session?.user ? (
          <form action={actions.logoutAction}>
            <Button type="submit" variant="ghost" size="sm">
              <LogOut />
              <span>Sign Out</span>
            </Button>
          </form>
        ) : (
          <form action={actions.loginAction}>
            <Button type="submit">Get Started</Button>
          </form>
        )}
      </nav>
    </header>
  );
}
