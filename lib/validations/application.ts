import z from "zod";

export const applicationSchema = z.object({
  companyName: z.string().min(3).max(100),
  roleDescription: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.string().min(10).max(500).optional(),
  ),
  role: z.string().min(2).max(100),
  status: z.enum(["APPLIED", "REJECTED", "INTERVIEW"]),
  link: z.url(),
  dateApplied: z.coerce.date().optional(),
});
