import { describe, expect, it } from "vitest";

import { applicationSchema } from "@/lib/validations/application";

describe("applicationSchema", () => {
  const validApplication = {
    companyName: "OpenAI",
    role: "Frontend Developer",
    roleDescription: "Build accessible user interfaces.",
    location: "Remote",
    workMode: "REMOTE" as const,
    status: "APPLIED" as const,
    link: "https://example.com/jobs/frontend-developer",
    dateApplied: "2026-10-01",
  };

  it("accepts a valid application", () => {
    const result = applicationSchema.safeParse(validApplication);

    expect(result.success).toBe(true);
  });

  it("trims company name and role", () => {
    const result = applicationSchema.parse({
      ...validApplication,
      companyName: "  OpenAI  ",
      role: "  Frontend Developer  ",
    });

    expect(result.companyName).toBe("OpenAI");
    expect(result.role).toBe("Frontend Developer");
  });

  it("rejects an empty company name", () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      companyName: "   ",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.companyName).toContain(
        "Company name is required",
      );
    }
  });

  it("rejects an empty role", () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      role: "   ",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.role).toContain(
        "Role is required",
      );
    }
  });

  it("converts an empty role description to undefined", () => {
    const result = applicationSchema.parse({
      ...validApplication,
      roleDescription: "   ",
    });

    expect(result.roleDescription).toBeUndefined();
  });

  it("converts an empty location to undefined", () => {
    const result = applicationSchema.parse({
      ...validApplication,
      location: "   ",
    });

    expect(result.location).toBeUndefined();
  });

  it("converts an empty link to undefined", () => {
    const result = applicationSchema.parse({
      ...validApplication,
      link: "   ",
    });

    expect(result.link).toBeUndefined();
  });

  it("accepts all supported work modes", () => {
    const workModes = ["ONSITE", "HYBRID", "REMOTE"] as const;

    for (const workMode of workModes) {
      const result = applicationSchema.safeParse({
        ...validApplication,
        workMode,
      });

      expect(result.success).toBe(true);
    }
  });

  it("rejects an unsupported work mode", () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      workMode: "FLEXIBLE",
    });

    expect(result.success).toBe(false);
  });

  it("accepts all supported application statuses", () => {
    const statuses = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;

    for (const status of statuses) {
      const result = applicationSchema.safeParse({
        ...validApplication,
        status,
      });

      expect(result.success).toBe(true);
    }
  });

  it("rejects an unsupported application status", () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      status: "PENDING",
    });

    expect(result.success).toBe(false);
  });

  it("coerces a valid date string into a Date", () => {
    const result = applicationSchema.parse({
      ...validApplication,
      dateApplied: "2026-10-01",
    });

    expect(result.dateApplied).toBeInstanceOf(Date);
  });

  it("rejects an invalid date", () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      dateApplied: "not-a-date",
    });

    expect(result.success).toBe(false);
  });

  it("allows optional application fields to be omitted", () => {
    const result = applicationSchema.safeParse({
      companyName: "OpenAI",
      role: "Frontend Developer",
      status: "APPLIED",
      dateApplied: "2026-10-01",
    });

    expect(result.success).toBe(true);
  });
});
