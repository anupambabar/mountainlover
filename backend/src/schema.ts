import { z } from 'zod'
import { sanitizeOptionalText, sanitizeText } from './utils/sanitize'

export const UserSchema = z
  .object({
    firstName: z.string().min(2).max(60),
    lastName: z.string().min(2).max(60),
    email: z.string().email().optional(),
    phone: z
      .string()
      .regex(/^[0-9+\-()\s]{6,20}$/, 'phone must be numeric and 6-20 chars long'),
  })
  .transform((value) => ({
    firstName: sanitizeText(value.firstName),
    lastName: sanitizeText(value.lastName),
    email: sanitizeOptionalText(value.email),
    phone: value.phone.trim(),
  }))

export type User = z.infer<typeof UserSchema>

export function validateUser(data: unknown): User {
  return UserSchema.parse(data)
}
