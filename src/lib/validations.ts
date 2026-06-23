import { z } from 'zod';

export const reportSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  category: z.enum(['Lampu', 'Jalan', 'Drainase', 'Lainnya']),
  description: z.string().min(10, "Description minimum 10 characters"),
  imageUrl: z.string().min(1, "Image is required"),
  latitude: z.number({ message: "Latitude is required" }),
  longitude: z.number({ message: "Longitude is required" }),
});

export const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'VERIFIED', 'IN_PROGRESS', 'COMPLETED']),
  adminReply: z.string().optional(),
  afterImageUrl: z.string().optional(),
});

export const apresiasiSchema = z.object({
  reportId: z.string().min(1),
  message: z.string().min(1),
  stickerId: z.string().min(1),
});
