"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statuses = [
  { value: "ALL", label: "All statuses" },
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEW", label: "Interviewing" },
  { value: "OFFER", label: "Offer received" },
  { value: "REJECTED", label: "Rejected" },
] as const;

interface ApplicationStatusFilterProps {
  value: string;
}

export default function ApplicationStatusFilter({
  value,
}: ApplicationStatusFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleStatusChange(status: string | null) {
    if (!status) return;

    const params = new URLSearchParams(searchParams.toString());

    if (status === "ALL") {
      params.delete("status");
    } else {
      params.set("status", status);
    }

    // Changing filters should return users to page one.
    params.delete("page");

    const query = params.toString();

    const nextUrl = query ? `${pathname}?${query}` : pathname;

    const currentQuery = searchParams.toString();

    const currentUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname;

    if (nextUrl === currentUrl) return;

    router.push(nextUrl);
  }

  const selectedStatus = statuses.find((status) => status.value === value);

  return (
    <Select value={value} onValueChange={handleStatusChange}>
      <SelectTrigger
        aria-label="Filter applications by status"
        className="w-full sm:w-45"
      >
        <SelectValue>{selectedStatus?.label ?? "All statuses"}</SelectValue>
      </SelectTrigger>

      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
