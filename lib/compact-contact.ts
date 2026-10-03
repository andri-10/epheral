import { z } from "zod";

export const compactContactSchema = z.object({
  formType: z.literal("compact"),
  name: z.string().trim().min(1).max(160),
  phone: z.string().trim().max(40).regex(/^[+\d\s().-]+$/).refine((value) => {
    const digits = value.replace(/\D/g, "").length;
    return digits >= 7 && digits <= 15;
  }),
  email: z.string().trim().max(254).pipe(z.union([z.string().email(), z.literal("")])).optional().default(""),
  message: z.string().trim().min(1).max(3000),
  website: z.string().max(0).optional().default(""),
  locale: z.enum(["sq", "en"]),
});
