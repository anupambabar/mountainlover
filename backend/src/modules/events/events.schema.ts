import { z } from 'zod'

const dateString = z
  .string()
  .datetime({ message: 'Must be an ISO8601 datetime string' })

export const EventCreateSchema = z
  .object({
    title: z.string().min(3).max(120),
    description: z.string().min(10).max(2048),
    location: z.string().min(2).max(120),
    startDate: dateString,
    endDate: dateString,
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    capacity: z.number().int().positive().max(5000),
  })
  .refine((value) => new Date(value.startDate) < new Date(value.endDate), {
    message: 'startDate must be before endDate',
    path: ['endDate'],
  })

export type EventCreateDTO = z.infer<typeof EventCreateSchema>

