"use client";

import Image from "next/image";

import { ChevronDown, LogOut, UserRound } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const displayName = user.name?.trim() || "JobTrack user";

  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-10 gap-2 rounded-full px-2"
            aria-label={`Open account menu for ${displayName}`}
          />
        }
      >
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand/10 text-xs font-semibold text-brand"
        >
          {user.image ? (
            <Image
              src={user.image}
              alt=""
              width={32}
              height={32}
              unoptimized
              className="size-full object-cover"
            />
          ) : initials ? (
            initials
          ) : (
            <UserRound className="size-4" aria-hidden="true" />
          )}
        </span>

        <span className="hidden max-w-36 truncate text-sm font-medium sm:block">
          {displayName}
        </span>

        <ChevronDown
          aria-hidden="true"
          className="hidden size-4 text-muted-foreground sm:block"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {/* Base UI requires GroupLabel inside Group */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-1 px-2 py-2">
            <span className="truncate text-sm font-semibold">
              {displayName}
            </span>

            {user.email && (
              <span className="truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm outline-none transition-colors hover:bg-accent focus-visible:bg-accent"
          >
            <LogOut aria-hidden="true" className="size-4" />
            Sign out
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
