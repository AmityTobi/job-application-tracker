"use client";

import { useState } from "react";
import type { SyntheticEvent } from "react";
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

  function updateSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    const trimmedSearch = value.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    } else {
      params.delete("search");
    }

    params.delete("page");

    const query = params.toString();

    const nextUrl = query ? `${pathname}?${query}` : pathname;

    const currentQuery = searchParams.toString();

    const currentUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname;

    if (nextUrl === currentUrl) return;

    router.push(nextUrl);
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    updateSearch(search);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setSearch(value);

    // Automatically restore results when search is cleared.
    if (value === "" && searchParams.has("search")) {
      updateSearch("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
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
          onChange={handleChange}
          placeholder="Search by company or job title"
          aria-label="Search applications"
          className="pl-9"
        />
      </div>

      <Button type="submit">Search</Button>
    </form>
  );
}
