import { BriefcaseBusiness, LogOut, Plus } from "lucide-react";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import * as actions from "@/actions";

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

        {/* Navigation actions */}
        {session?.user ? (
          <div className="flex items-center gap-1 sm:gap-2">
            <Button size="sm">
              <Plus />
              <span className="hidden sm:inline">Add Application</span>
              <span className="sm:hidden">Add</span>
            </Button>

            <form action={actions.logoutAction}>
              <Button type="submit" variant="ghost" size="sm">
                <LogOut />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </form>
          </div>
        ) : (
          <form action={actions.loginAction}>
            <Button type="submit">Get Started</Button>
          </form>
        )}
      </nav>
    </header>
  );
}
