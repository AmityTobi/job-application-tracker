"use client";

import { useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ApplicationSearchProps {
  defaultValue?: string;
}

export default function ApplicationSearch({
  defaultValue = "",
}: ApplicationSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(defaultValue);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    } else {
      params.delete("search");
    }

    // A new search should always begin on the first page.
    params.delete("page");

    const query = params.toString();

    const nextUrl = query ? `${pathname}?${query}` : pathname;

    const currentQuery = searchParams.toString();

    const currentUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname;

    // Avoid unnecessary navigation.
    if (nextUrl === currentUrl) return;

    router.push(nextUrl);
  }

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      className="flex w-full items-center gap-2 sm:max-w-md"
    >
      <div className="relative min-w-0 flex-1">
        <Search
          aria-hidden="true"
          className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          type="search"
          name="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search company or role..."
          aria-label="Search applications"
          className="pl-9"
        />
      </div>

      <Button type="submit">Search</Button>
    </form>
  );
}
