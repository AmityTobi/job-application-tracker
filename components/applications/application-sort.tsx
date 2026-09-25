"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "company-asc", label: "Company name (A–Z)" },
  { value: "company-desc", label: "Company name (Z–A)" },
] as const;

interface ApplicationSortProps {
  value: string;
}

export default function ApplicationSort({ value }: ApplicationSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedOption = sortOptions.find((option) => option.value === value);

  function handleSortChange(sort: string | null) {
    if (!sort) return;

    const params = new URLSearchParams(searchParams.toString());

    if (sort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }

    // A different sorting order should start on page one.
    params.delete("page");

    const query = params.toString();

    const nextUrl = query ? `${pathname}?${query}` : pathname;

    const currentQuery = searchParams.toString();

    const currentUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname;

    if (nextUrl === currentUrl) return;

    router.push(nextUrl);
  }

  return (
    <Select value={value} onValueChange={handleSortChange}>
      <SelectTrigger aria-label="Sort applications" className="w-full sm:w-52">
        <SelectValue>{selectedOption?.label ?? "Newest first"}</SelectValue>
      </SelectTrigger>

      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
