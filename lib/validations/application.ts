import { z } from "zod";

export const applicationSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required"),

  role: z.string().trim().min(1, "Role is required"),

  roleDescription: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),

  location: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),

  workMode: z.enum(["ONSITE", "HYBRID", "REMOTE"]).optional(),

  status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED"]),

  link: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),

  dateApplied: z.coerce.date(),
});
