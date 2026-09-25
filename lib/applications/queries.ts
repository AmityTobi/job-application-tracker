import "server-only";

import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

import { PAGE_SIZE, type SortOption } from "@/lib/applications/search-params";

interface GetApplicationsOptions {
  userId: string;
  searchTerm: string;
  selectedStatus?: "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";
  selectedSort: SortOption;
  pageNumber: number;
}

const sortOptions = {
  newest: [{ dateApplied: "desc" }, { id: "desc" }],
  oldest: [{ dateApplied: "asc" }, { id: "asc" }],
  "company-asc": [{ companyName: "asc" }, { id: "asc" }],
  "company-desc": [{ companyName: "desc" }, { id: "desc" }],
} satisfies Record<SortOption, Prisma.ApplicationOrderByWithRelationInput[]>;

export async function getApplications({
  userId,
  searchTerm,
  selectedStatus,
  selectedSort,
  pageNumber,
}: GetApplicationsOptions) {
  // Build reusable filtering conditions.
  const where: Prisma.ApplicationWhereInput = {
    userId,

    ...(searchTerm && {
      OR: [
        { companyName: { contains: searchTerm } },
        { role: { contains: searchTerm } },
      ],
    }),

    ...(selectedStatus && {
      status: selectedStatus,
    }),
  };

  // Retrieve all user applications for dashboard statistics,
  // and count the applications matching the active filters.
  const [allApplications, totalApplications] = await Promise.all([
    db.application.findMany({
      where: { userId },
    }),

    db.application.count({
      where,
    }),
  ]);

  // Calculate pagination.
  const totalPages = Math.max(1, Math.ceil(totalApplications / PAGE_SIZE));

  const currentPage = Math.min(pageNumber, totalPages);

  // Retrieve only the applications belonging to the current page.
  const applications = await db.application.findMany({
    where,
    orderBy: sortOptions[selectedSort],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return {
    applications,
    allApplications,
    totalApplications,
    totalPages,
    currentPage,
  };
}
