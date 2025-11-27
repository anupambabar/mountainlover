import { escape, stripLow, trim } from 'validator'

export function sanitizeText(value: string): string {
  const trimmed = trim(value)
  const withoutControlChars = stripLow(trimmed, true)
  return escape(withoutControlChars)
}

export function sanitizeOptionalText(value?: string | null): string | undefined {
  if (value === undefined || value === null) return undefined
  return sanitizeText(value)
}

