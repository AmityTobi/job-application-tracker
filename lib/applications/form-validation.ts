import type {
  ApplicationFieldErrors,
  ApplicationFormValues,
} from "@/components/applications/application-fields";

export function validateApplicationForm(
  values: ApplicationFormValues,
): ApplicationFieldErrors {
  const errors: ApplicationFieldErrors = {};

  if (!values.companyName.trim()) {
    errors.companyName = "Company name is required.";
  }

  if (!values.role.trim()) {
    errors.role = "Role is required.";
  }

  if (!values.status) {
    errors.status = "Please select a status.";
  }

  if (!values.dateApplied) {
    errors.dateApplied = "Date applied is required.";
  } else {
    const date = new Date(values.dateApplied);

    if (Number.isNaN(date.getTime())) {
      errors.dateApplied = "Enter a valid date.";
    }
  }

  if (values.link.trim()) {
    try {
      const url = new URL(values.link);

      if (url.protocol !== "https:" && url.protocol !== "http:") {
        errors.link = "Enter a valid HTTP or HTTPS URL.";
      }
    } catch {
      errors.link = "Enter a valid URL.";
    }
  }

  return errors;
}

const fieldNames: (keyof ApplicationFormValues)[] = [
  "companyName",
  "role",
  "location",
  "workMode",
  "status",
  "dateApplied",
  "link",
  "roleDescription",
];

export function getServerFieldErrors(errors: unknown): ApplicationFieldErrors {
  const result: ApplicationFieldErrors = {};

  if (!errors || typeof errors !== "object" || !("properties" in errors)) {
    return result;
  }

  const properties = errors.properties;

  if (!properties || typeof properties !== "object") {
    return result;
  }

  for (const field of fieldNames) {
    const fieldError = (properties as Record<string, { errors?: string[] }>)[
      field
    ];

    if (fieldError?.errors?.[0]) {
      result[field] = fieldError.errors[0];
    }
  }

  return result;
}
