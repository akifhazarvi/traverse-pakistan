import { z } from "zod";

export const BookingInputSchema = z.object({
  departureId: z.string().uuid(),
  seats: z.number().int().min(1).max(100),
  singleRooms: z.number().int().min(0).max(50),
  contact: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().max(254),
    phone: z.string().regex(
      /^(\+92|0)?[3][0-9]{2}[0-9]{7}$/,
      "Invalid Pakistani phone"
    ),
  }),
  participants: z.array(
    z.object({
      fullName: z.string().min(2).max(100),
      dateOfBirth: z.string().date().optional(),
      cnicOrPassport: z.string().max(20).optional(),
      dietary: z.string().max(100).optional(),
      emergencyContact: z.string().optional(),
    })
  ),
  notes: z.string().max(500).optional(),
});

export type BookingInput = z.infer<typeof BookingInputSchema>;

export const ApiErrorSchema = z.object({
  error: z.string(),
  details: z.record(z.string(), z.any()).optional(),
});
