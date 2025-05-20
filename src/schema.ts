import { z } from "zod";

export const jobApplicationFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required.").trim(),
  position: z.string().min(1, "Position is required.").trim(),
  workType: z.string().min(1, "Please delect a work type."),
  status: z.string().min(1, "Please select an application status"),
  appliedAt: z.string().optional(),
  notes: z.string().trim().optional(),
  uid: z.string().optional(),
});

export type JobApplication = z.infer<typeof jobApplicationFormSchema>;
