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

  // Count applications by status without retrieving every record.
  const [statusGroups, totalApplications] = await Promise.all([
    db.application.groupBy({
      by: ["status"],
      where: { userId },
      _count: {
        _all: true,
      },
    }),

    db.application.count({
      where,
    }),
  ]);

  const stats = {
    total: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
  };

  for (const group of statusGroups) {
    const count = group._count._all;

    stats.total += count;

    switch (group.status) {
      case "INTERVIEW":
        stats.interviews = count;
        break;

      case "OFFER":
        stats.offers = count;
        break;

      case "REJECTED":
        stats.rejected = count;
        break;
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalApplications / PAGE_SIZE));

  const currentPage = Math.min(pageNumber, totalPages);

  const applications = await db.application.findMany({
    where,
    orderBy: sortOptions[selectedSort],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return {
    applications,
    stats,
    totalApplications,
    totalPages,
    currentPage,
  };
}
