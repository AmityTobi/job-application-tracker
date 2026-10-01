import { describe, expect, it } from "vitest";

import {
  PAGE_SIZE,
  parseApplicationSearchParams,
} from "@/lib/applications/search-params";

describe("parseApplicationSearchParams", () => {
  it("returns defaults when no search parameters are provided", () => {
    const result = parseApplicationSearchParams({});

    expect(result).toEqual({
      searchTerm: "",
      selectedStatus: undefined,
      selectedSort: "newest",
      pageNumber: 1,
    });
  });

  describe("search", () => {
    it("returns a trimmed search term", () => {
      const result = parseApplicationSearchParams({
        search: "  frontend developer  ",
      });

      expect(result.searchTerm).toBe("frontend developer");
    });

    it("limits the search term to 100 characters", () => {
      const result = parseApplicationSearchParams({
        search: "a".repeat(150),
      });

      expect(result.searchTerm).toHaveLength(100);
    });

    it("ignores search arrays", () => {
      const result = parseApplicationSearchParams({
        search: ["frontend", "developer"],
      });

      expect(result.searchTerm).toBe("");
    });
  });

  describe("status", () => {
    it.each(["APPLIED", "INTERVIEW", "OFFER", "REJECTED"])(
      "accepts the %s status",
      (status) => {
        const result = parseApplicationSearchParams({
          status,
        });

        expect(result.selectedStatus).toBe(status);
      },
    );

    it("ignores an unsupported status", () => {
      const result = parseApplicationSearchParams({
        status: "PENDING",
      });

      expect(result.selectedStatus).toBeUndefined();
    });

    it("ignores status arrays", () => {
      const result = parseApplicationSearchParams({
        status: ["APPLIED", "INTERVIEW"],
      });

      expect(result.selectedStatus).toBeUndefined();
    });
  });

  describe("sort", () => {
    it.each(["newest", "oldest", "company-asc", "company-desc"])(
      "accepts the %s sort option",
      (sort) => {
        const result = parseApplicationSearchParams({
          sort,
        });

        expect(result.selectedSort).toBe(sort);
      },
    );

    it("defaults to newest for an unsupported sort option", () => {
      const result = parseApplicationSearchParams({
        sort: "role-asc",
      });

      expect(result.selectedSort).toBe("newest");
    });

    it("defaults to newest for a sort array", () => {
      const result = parseApplicationSearchParams({
        sort: ["newest", "oldest"],
      });

      expect(result.selectedSort).toBe("newest");
    });
  });

  describe("page", () => {
    it("accepts a positive page number", () => {
      const result = parseApplicationSearchParams({
        page: "3",
      });

      expect(result.pageNumber).toBe(3);
    });

    it("defaults page zero to page one", () => {
      const result = parseApplicationSearchParams({
        page: "0",
      });

      expect(result.pageNumber).toBe(1);
    });

    it("defaults a negative page to page one", () => {
      const result = parseApplicationSearchParams({
        page: "-2",
      });

      expect(result.pageNumber).toBe(1);
    });

    it("defaults a decimal page to page one", () => {
      const result = parseApplicationSearchParams({
        page: "2.5",
      });

      expect(result.pageNumber).toBe(1);
    });

    it("defaults non-numeric page values to page one", () => {
      const result = parseApplicationSearchParams({
        page: "hello",
      });

      expect(result.pageNumber).toBe(1);
    });

    it("defaults page arrays to page one", () => {
      const result = parseApplicationSearchParams({
        page: ["2", "3"],
      });

      expect(result.pageNumber).toBe(1);
    });

    it("rejects numbers larger than the safe integer limit", () => {
      const result = parseApplicationSearchParams({
        page: "999999999999999999999999",
      });

      expect(result.pageNumber).toBe(1);
    });
  });

  it("parses multiple valid parameters together", () => {
    const result = parseApplicationSearchParams({
      search: "  frontend  ",
      status: "INTERVIEW",
      sort: "oldest",
      page: "2",
    });

    expect(result).toEqual({
      searchTerm: "frontend",
      selectedStatus: "INTERVIEW",
      selectedSort: "oldest",
      pageNumber: 2,
    });
  });
});

describe("PAGE_SIZE", () => {
  it("limits application pages to 10 items", () => {
    expect(PAGE_SIZE).toBe(10);
  });
});
