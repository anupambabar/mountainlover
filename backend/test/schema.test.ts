import { describe, it, expect } from 'vitest'
import { UserSchema } from '../src/schema'

describe('UserSchema', () => {
  it('validates a good user', () => {
    const parsed = UserSchema.parse({ firstName: 'Al', lastName: 'Be', phone: '123456' })
    expect(parsed.firstName).toBe('Al')
  })

  it('rejects missing phone', () => {
    const payload = { firstName: 'A', lastName: 'B' } as unknown
    expect(() => UserSchema.parse(payload)).toThrow()
  })
})
