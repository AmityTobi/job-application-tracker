export const PAGE_SIZE = 10;

const validStatuses = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;

const validSortOptions = [
  "newest",
  "oldest",
  "company-asc",
  "company-desc",
] as const;

export type SortOption = (typeof validSortOptions)[number];

export type ApplicationSearchParams = {
  search?: string | string[];
  status?: string | string[];
  sort?: string | string[];
  page?: string | string[];
};

export function parseApplicationSearchParams(params: ApplicationSearchParams) {
  const { search, status, sort, page } = params;

  // Normalize the search term.
  const searchTerm =
    typeof search === "string" ? search.trim().slice(0, 100) : "";

  // Accept only supported application statuses.
  const selectedStatus = validStatuses.find((value) => value === status);

  // Accept only supported sorting options.
  const selectedSort: SortOption =
    validSortOptions.find((option) => option === sort) ?? "newest";

  // Accept only positive, safe integers.
  const pageNumber =
    typeof page === "string" &&
    /^[1-9]\d*$/.test(page) &&
    Number.isSafeInteger(Number(page))
      ? Number(page)
      : 1;

  return {
    searchTerm,
    selectedStatus,
    selectedSort,
    pageNumber,
  };
}
