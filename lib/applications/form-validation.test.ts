import { describe, expect, it } from "vitest";

import {
  getServerFieldErrors,
  validateApplicationForm,
} from "@/lib/applications/form-validation";

import type { ApplicationFormValues } from "@/components/applications/application-fields";

function createValidValues(
  overrides: Partial<ApplicationFormValues> = {},
): ApplicationFormValues {
  return {
    companyName: "OpenAI",
    role: "Frontend Developer",
    location: "Remote",
    workMode: "REMOTE",
    status: "APPLIED",
    dateApplied: "2026-10-01",
    link: "https://example.com/jobs/frontend-developer",
    roleDescription: "Frontend engineering role",
    ...overrides,
  };
}

describe("validateApplicationForm", () => {
  it("returns no errors for valid application values", () => {
    const values = createValidValues();

    expect(validateApplicationForm(values)).toEqual({});
  });

  it("requires a company name", () => {
    const values = createValidValues({
      companyName: "   ",
    });

    expect(validateApplicationForm(values)).toEqual({
      companyName: "Company name is required.",
    });
  });

  it("requires a role", () => {
    const values = createValidValues({
      role: "   ",
    });

    expect(validateApplicationForm(values)).toEqual({
      role: "Role is required.",
    });
  });

  it("requires a status", () => {
    const values = createValidValues({
      status: "" as ApplicationFormValues["status"],
    });

    expect(validateApplicationForm(values)).toEqual({
      status: "Please select a status.",
    });
  });

  it("requires a date applied", () => {
    const values = createValidValues({
      dateApplied: "",
    });

    expect(validateApplicationForm(values)).toEqual({
      dateApplied: "Date applied is required.",
    });
  });

  it("rejects an invalid date", () => {
    const values = createValidValues({
      dateApplied: "definitely-not-a-date",
    });

    expect(validateApplicationForm(values)).toEqual({
      dateApplied: "Enter a valid date.",
    });
  });

  it("accepts an HTTP application URL", () => {
    const values = createValidValues({
      link: "http://example.com/jobs/frontend",
    });

    expect(validateApplicationForm(values)).toEqual({});
  });

  it("accepts an HTTPS application URL", () => {
    const values = createValidValues({
      link: "https://example.com/jobs/frontend",
    });

    expect(validateApplicationForm(values)).toEqual({});
  });

  it("allows an empty application URL", () => {
    const values = createValidValues({
      link: "",
    });

    expect(validateApplicationForm(values)).toEqual({});
  });

  it("rejects malformed URLs", () => {
    const values = createValidValues({
      link: "not-a-url",
    });

    expect(validateApplicationForm(values)).toEqual({
      link: "Enter a valid URL.",
    });
  });

  it("rejects URLs using protocols other than HTTP or HTTPS", () => {
    const values = createValidValues({
      link: "ftp://example.com/job",
    });

    expect(validateApplicationForm(values)).toEqual({
      link: "Enter a valid HTTP or HTTPS URL.",
    });
  });

  it("can return multiple field errors at once", () => {
    const values = createValidValues({
      companyName: "",
      role: "",
      dateApplied: "",
      link: "invalid-url",
    });

    expect(validateApplicationForm(values)).toEqual({
      companyName: "Company name is required.",
      role: "Role is required.",
      dateApplied: "Date applied is required.",
      link: "Enter a valid URL.",
    });
  });
});

describe("getServerFieldErrors", () => {
  it("extracts field errors from a Zod tree error", () => {
    const errors = {
      errors: [],
      properties: {
        companyName: {
          errors: ["Company name is required"],
        },
        role: {
          errors: ["Role is required"],
        },
        link: {
          errors: ["Invalid URL"],
        },
      },
    };

    expect(getServerFieldErrors(errors)).toEqual({
      companyName: "Company name is required",
      role: "Role is required",
      link: "Invalid URL",
    });
  });

  it("uses only the first error for each field", () => {
    const errors = {
      properties: {
        companyName: {
          errors: ["Company name is required", "Another company error"],
        },
      },
    };

    expect(getServerFieldErrors(errors)).toEqual({
      companyName: "Company name is required",
    });
  });

  it("ignores fields that are not application fields", () => {
    const errors = {
      properties: {
        somethingElse: {
          errors: ["Unknown field error"],
        },
        role: {
          errors: ["Role is required"],
        },
      },
    };

    expect(getServerFieldErrors(errors)).toEqual({
      role: "Role is required",
    });
  });

  it("returns an empty object when errors are null", () => {
    expect(getServerFieldErrors(null)).toEqual({});
  });

  it("returns an empty object for a message-only server error", () => {
    expect(
      getServerFieldErrors({
        message: "Something went wrong",
      }),
    ).toEqual({});
  });

  it("returns an empty object when properties is invalid", () => {
    expect(
      getServerFieldErrors({
        properties: null,
      }),
    ).toEqual({});
  });
});
