import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ApplicationPaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: {
    search?: string;
    status?: string;
    sort?: string;
  };
}

export default function ApplicationPagination({
  currentPage,
  totalPages,
  searchParams,
}: ApplicationPaginationProps) {
  // Hide pagination when there's only one page.
  if (totalPages <= 1) return null;

  function createPageUrl(page: number) {
    const params = new URLSearchParams();

    // Preserve search, status and sorting.
    if (searchParams.search) {
      params.set("search", searchParams.search);
    }

    if (searchParams.status) {
      params.set("status", searchParams.status);
    }

    if (searchParams.sort) {
      params.set("sort", searchParams.sort);
    }

    params.set("page", String(page));

    return `/?${params.toString()}`;
  }

  return (
    <nav
      aria-label="Application pagination"
      className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Button
            nativeButton={false}
            variant="outline"
            render={<Link href={createPageUrl(currentPage - 1)} />}
          >
            <ChevronLeft aria-hidden="true" />
            Previous
          </Button>
        ) : (
          <Button variant="outline" disabled>
            <ChevronLeft aria-hidden="true" />
            Previous
          </Button>
        )}

        {currentPage < totalPages ? (
          <Button
            nativeButton={false}
            variant="outline"
            render={<Link href={createPageUrl(currentPage + 1)} />}
          >
            Next
            <ChevronRight aria-hidden="true" />
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Next
            <ChevronRight aria-hidden="true" />
          </Button>
        )}
      </div>
    </nav>
  );
}
